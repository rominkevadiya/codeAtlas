from typing import List, Optional
import os
import zipfile
import uuid
import json
import subprocess
from django.conf import settings
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from apps.repositories.models import Repository, RepositoryStatus
from apps.common.exceptions import CodeAtlasException

class RepositoryNotFound(CodeAtlasException):
    def __init__(self, message="Repository not found"):
        super().__init__(message, "REPOSITORY_NOT_FOUND", 404)

def broadcast_progress(repo_id: str, status: str, progress: int, message: str = "", error: str = None):
    """
    Helper function to send progress updates over Django Channels WebSocket.
    """
    channel_layer = get_channel_layer()
    if channel_layer:
        async_to_sync(channel_layer.group_send)(
            f"repo_progress_{repo_id}",
            {
                "type": "repo_progress",
                "repo_id": repo_id,
                "status": status,
                "progress": progress,
                "message": message,
                "error": error,
            }
        )

class RepoService:
    @staticmethod
    def create_repository(name: str, url: str, owner=None) -> Repository:
        repo = Repository.objects.create(name=name, url=url, owner=owner)
        return repo

    @staticmethod
    def _initialize_repo(name: str, url: str, owner, repo_id: Optional[str]) -> tuple[Repository, str]:
        """Initializes the repository record in DB and creates the local storage directory."""
        repo_uuid = repo_id or str(uuid.uuid4())
        extract_path = os.path.join(settings.MEDIA_ROOT, 'repositories', repo_uuid)
        os.makedirs(extract_path, exist_ok=True)

        repo, _ = Repository.objects.get_or_create(
            id=repo_uuid,
            defaults={
                'name': name,
                'url': url,
                'owner': owner,
                'is_cloned': False,
                'status': RepositoryStatus.PENDING,
            }
        )
        repo.local_path = extract_path
        repo.save(update_fields=['local_path'])
        return repo, extract_path

    @staticmethod
    def _process_repository(repo: Repository, extract_path: str) -> Repository:
        """
        Core pipeline for processing a repository:
        1. Parses the source code into an AST.
        2. Builds a NetworkX knowledge graph.
        3. Saves the graph as JSON and updates status.
        """
        try:
            # ── 2. PARSING AST (50%) ──
            repo.status = RepositoryStatus.PARSING
            repo.save(update_fields=['status'])
            broadcast_progress(repo.id, RepositoryStatus.PARSING, 50, "Parsing AST entities & relationships...")

            from apps.parser.services import ParserService
            from apps.graph.services import GraphService

            parsed_data = ParserService.parse_repository(extract_path)

            # ── 3. BUILDING KNOWLEDGE GRAPH (75%) ──
            repo.status = RepositoryStatus.BUILDING_GRAPH
            repo.save(update_fields=['status'])
            broadcast_progress(repo.id, RepositoryStatus.BUILDING_GRAPH, 75, "Building NetworkX knowledge graph...")

            graph_data = GraphService.build_graph(parsed_data)

            graph_path = os.path.join(extract_path, 'knowledge_graph.json')
            with open(graph_path, 'w') as f:
                json.dump(graph_data, f, indent=2)

            # ── 4. READY (100%) ──
            repo.is_cloned = True
            repo.status = RepositoryStatus.READY
            repo.error_message = None
            repo.save(update_fields=['is_cloned', 'status', 'error_message'])
            broadcast_progress(repo.id, RepositoryStatus.READY, 100, "Repository processing complete.")
            return repo

        except Exception as e:
            repo.status = RepositoryStatus.FAILED
            repo.error_message = str(e)
            repo.save(update_fields=['status', 'error_message'])
            broadcast_progress(repo.id, RepositoryStatus.FAILED, 0, f"Error: {str(e)}", error=str(e))
            raise e

    @staticmethod
    def upload_and_extract_repository(name: str, zip_file, owner=None, repo_id: Optional[str] = None) -> Repository:
        """Handles uploading a ZIP archive, extracting it safely, and initiating processing."""
        repo, extract_path = RepoService._initialize_repo(name, "local://uploaded", owner, repo_id)

        try:
            # ── 1. EXTRACTING ZIP (25%) ──
            repo.status = RepositoryStatus.EXTRACTING
            repo.save(update_fields=['status'])
            broadcast_progress(repo.id, RepositoryStatus.EXTRACTING, 25, "Extracting repository archive...")

            real_extract = os.path.realpath(extract_path)
            with zipfile.ZipFile(zip_file, 'r') as zip_ref:
                for member in zip_ref.namelist():
                    member_path = os.path.realpath(os.path.join(real_extract, member))
                    if not member_path.startswith(real_extract + os.sep) and member_path != real_extract:
                        raise ValueError(f"Malicious ZIP detected: path traversal in entry '{member}'.")
                zip_ref.extractall(extract_path)

            return RepoService._process_repository(repo, extract_path)

        except Exception as e:
            repo.status = RepositoryStatus.FAILED
            repo.error_message = str(e)
            repo.save(update_fields=['status', 'error_message'])
            broadcast_progress(repo.id, RepositoryStatus.FAILED, 0, f"Error: {str(e)}", error=str(e))
            raise e

    @staticmethod
    def clone_github_repository(name: str, github_url: str, owner=None, repo_id: Optional[str] = None) -> Repository:
        """Handles cloning a repository from GitHub with network retries, and initiating processing."""
        repo, extract_path = RepoService._initialize_repo(name, github_url, owner, repo_id)

        try:
            # ── 1. CLONING GITHUB REPO (25%) ──
            repo.status = RepositoryStatus.EXTRACTING
            repo.save(update_fields=['status'])
            broadcast_progress(repo.id, RepositoryStatus.EXTRACTING, 25, "Cloning repository from GitHub...")

            import time
            import shutil
            max_retries = 3
            for attempt in range(max_retries):
                result = subprocess.run(
                    ["git", "clone", "--depth", "1", github_url, extract_path],
                    capture_output=True,
                    text=True,
                    timeout=120
                )
                if result.returncode == 0:
                    break
                else:
                    if attempt < max_retries - 1:
                        if os.path.exists(extract_path):
                            shutil.rmtree(extract_path, ignore_errors=True)
                            os.makedirs(extract_path, exist_ok=True)
                        time.sleep(2 ** attempt)
                    else:
                        raise ValueError(f"Failed to clone repository after {max_retries} attempts: {result.stderr}")

            return RepoService._process_repository(repo, extract_path)

        except subprocess.TimeoutExpired as e:
            repo.status = RepositoryStatus.FAILED
            error_msg = "Failed to clone repository: Timeout exceeded (120s)."
            repo.error_message = error_msg
            repo.save(update_fields=['status', 'error_message'])
            broadcast_progress(repo.id, RepositoryStatus.FAILED, 0, error_msg, error=error_msg)
            raise e
        except Exception as e:
            repo.status = RepositoryStatus.FAILED
            repo.error_message = str(e)
            repo.save(update_fields=['status', 'error_message'])
            broadcast_progress(repo.id, RepositoryStatus.FAILED, 0, f"Error: {str(e)}", error=str(e))
            raise e

    @staticmethod
    def get_repository(repo_id: str) -> Repository:
        """Retrieves a repository record by ID or raises RepositoryNotFound."""
        try:
            return Repository.objects.get(id=repo_id)
        except Repository.DoesNotExist:
            raise RepositoryNotFound()


    @staticmethod
    def delete_repository(repo_id: str):
        """Deletes a repository record."""
        repo = RepoService.get_repository(repo_id)
        repo.delete()

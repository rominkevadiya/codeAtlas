from typing import List, Optional
import os
import zipfile
import uuid
import json
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
    def upload_and_extract_repository(name: str, zip_file, owner=None, repo_id: Optional[str] = None) -> Repository:
        # Generate or use provided UUID
        repo_uuid = repo_id or str(uuid.uuid4())
        extract_path = os.path.join(settings.MEDIA_ROOT, 'repositories', repo_uuid)
        os.makedirs(extract_path, exist_ok=True)

        # Create or update repository record with PENDING status
        repo, created = Repository.objects.get_or_create(
            id=repo_uuid,
            defaults={
                'name': name,
                'url': "local://uploaded",
                'owner': owner,
                'is_cloned': False,
                'local_path': extract_path,
                'status': RepositoryStatus.PENDING,
            }
        )

        try:
            # ── 1. EXTRACTING ZIP (25%) ──
            repo.status = RepositoryStatus.EXTRACTING
            repo.save(update_fields=['status'])
            broadcast_progress(repo_uuid, RepositoryStatus.EXTRACTING, 25, "Extracting repository archive...")

            real_extract = os.path.realpath(extract_path)
            with zipfile.ZipFile(zip_file, 'r') as zip_ref:
                for member in zip_ref.namelist():
                    member_path = os.path.realpath(os.path.join(real_extract, member))
                    if not member_path.startswith(real_extract + os.sep) and member_path != real_extract:
                        raise ValueError(f"Malicious ZIP detected: path traversal in entry '{member}'.")
                zip_ref.extractall(extract_path)

            # ── 2. PARSING AST (50%) ──
            repo.status = RepositoryStatus.PARSING
            repo.save(update_fields=['status'])
            broadcast_progress(repo_uuid, RepositoryStatus.PARSING, 50, "Parsing AST entities & relationships...")

            from apps.parser.services import ParserService
            from apps.graph.services import GraphService

            parsed_data = ParserService.parse_repository(extract_path)

            # ── 3. BUILDING KNOWLEDGE GRAPH (75%) ──
            repo.status = RepositoryStatus.BUILDING_GRAPH
            repo.save(update_fields=['status'])
            broadcast_progress(repo_uuid, RepositoryStatus.BUILDING_GRAPH, 75, "Building NetworkX knowledge graph...")

            graph_data = GraphService.build_graph(parsed_data)

            graph_path = os.path.join(extract_path, 'knowledge_graph.json')
            with open(graph_path, 'w') as f:
                json.dump(graph_data, f, indent=2)

            # ── 4. READY (100%) ──
            repo.is_cloned = True
            repo.status = RepositoryStatus.READY
            repo.error_message = None
            repo.save(update_fields=['is_cloned', 'status', 'error_message'])
            broadcast_progress(repo_uuid, RepositoryStatus.READY, 100, "Repository processing complete.")

            return repo

        except Exception as e:
            repo.status = RepositoryStatus.FAILED
            repo.error_message = str(e)
            repo.save(update_fields=['status', 'error_message'])
            broadcast_progress(repo_uuid, RepositoryStatus.FAILED, 0, f"Error: {str(e)}", error=str(e))
            raise e

    @staticmethod
    def get_repository(repo_id: str) -> Repository:
        try:
            return Repository.objects.get(id=repo_id)
        except Repository.DoesNotExist:
            raise RepositoryNotFound()

    @staticmethod
    def list_repositories(owner=None) -> List[Repository]:
        if owner:
            return list(Repository.objects.filter(owner=owner))
        return list(Repository.objects.all())

    @staticmethod
    def delete_repository(repo_id: str):
        repo = RepoService.get_repository(repo_id)
        repo.delete()

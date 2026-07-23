from typing import List, Optional
from django.core.exceptions import ObjectDoesNotExist
from apps.repositories.models import Repository
from apps.common.exceptions import CodeAtlasException

class RepositoryNotFound(CodeAtlasException):
    def __init__(self, message="Repository not found"):
        super().__init__(message, "REPOSITORY_NOT_FOUND", 404)

class RepoService:
    @staticmethod
    def create_repository(name: str, url: str, owner=None) -> Repository:
        repo = Repository.objects.create(name=name, url=url, owner=owner)
        return repo

    @staticmethod
    def upload_and_extract_repository(name: str, zip_file, owner=None) -> Repository:
        import zipfile
        import os
        from django.conf import settings
        import uuid

        # Create a unique ID for the folder
        repo_uuid = str(uuid.uuid4())
        extract_path = os.path.join(settings.MEDIA_ROOT, 'repositories', repo_uuid)
        os.makedirs(extract_path, exist_ok=True)

        # ── Security: Validate all ZIP entries for path traversal (Zip Slip) ──
        real_extract = os.path.realpath(extract_path)
        try:
            with zipfile.ZipFile(zip_file, 'r') as zip_ref:
                for member in zip_ref.namelist():
                    member_path = os.path.realpath(os.path.join(real_extract, member))
                    if not member_path.startswith(real_extract + os.sep) and member_path != real_extract:
                        raise ValueError(f"Malicious ZIP detected: path traversal in entry '{member}'.")
                zip_ref.extractall(extract_path)
        except zipfile.BadZipFile:
            raise ValueError("The uploaded file is not a valid ZIP archive.")

        # Parse repository and build graph
        from apps.parser.services import ParserService
        from apps.graph.services import GraphService
        import json
        
        parsed_data = ParserService.parse_repository(extract_path)
        graph_data = GraphService.build_graph(parsed_data)
        
        graph_path = os.path.join(extract_path, 'knowledge_graph.json')
        with open(graph_path, 'w') as f:
            json.dump(graph_data, f, indent=2)
            
        # Optional: if zip extracts a single root folder, we could adjust local_path
        # For simplicity, we just point to the extract path
        repo = Repository.objects.create(
            id=repo_uuid,
            name=name,
            url="local://uploaded",
            owner=owner,
            is_cloned=True,
            local_path=extract_path
        )
        return repo

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

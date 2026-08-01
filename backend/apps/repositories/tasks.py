from celery import shared_task
import os
from apps.repositories.services import RepoService

@shared_task
def process_repository_task(name: str, temp_zip_path: str = None, owner_id: str = None, repo_id: str = None, github_url: str = None):
    """
    Celery background task to extract repository ZIP archive OR clone GitHub repo,
    parse Tree-sitter AST, and construct knowledge graph with WebSocket progress broadcasts.
    """
    try:
        owner_user = None
        if owner_id:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            owner_user = User.objects.filter(id=owner_id).first()

        if github_url:
            RepoService.clone_github_repository(
                name=name,
                github_url=github_url,
                owner=owner_user,
                repo_id=repo_id
            )
        elif temp_zip_path:
            with open(temp_zip_path, 'rb') as zip_file:
                RepoService.upload_and_extract_repository(
                    name=name,
                    zip_file=zip_file,
                    owner=owner_user,
                    repo_id=repo_id
                )
        else:
            raise ValueError("Either temp_zip_path or github_url must be provided.")
    finally:
        # Clean up temporary uploaded file from temp storage if it exists
        if temp_zip_path and os.path.exists(temp_zip_path):
            try:
                os.remove(temp_zip_path)
            except OSError:
                pass

from celery import shared_task
import os
from apps.repositories.services import RepoService

@shared_task
def process_repository_task(name: str, temp_zip_path: str, owner_id: str = None, repo_id: str = None):
    """
    Celery background task to extract repository ZIP archive, parse Tree-sitter AST, 
    and construct knowledge graph with WebSocket progress broadcasts.
    """
    try:
        owner_user = None
        if owner_id:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            owner_user = User.objects.filter(id=owner_id).first()

        with open(temp_zip_path, 'rb') as zip_file:
            RepoService.upload_and_extract_repository(
                name=name,
                zip_file=zip_file,
                owner=owner_user,
                repo_id=repo_id
            )
    finally:
        # Clean up temporary uploaded file from temp storage
        if os.path.exists(temp_zip_path):
            try:
                os.remove(temp_zip_path)
            except OSError:
                pass

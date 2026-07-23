import os
import json
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from apps.repositories.models import Repository, Branch, Commit
from apps.repositories.serializers import RepositorySerializer, BranchSerializer, CommitSerializer
from apps.repositories.services import RepoService, RepositoryNotFound

class RepositoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows repositories to be viewed or edited.
    """
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def create(self, request, *args, **kwargs):
        # Delegate creation to the service layer as per DDD
        name = request.data.get('name')
        url = request.data.get('url')
        
        if not name or not url:
            return Response({"error": "Name and URL are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # In a real app, you would pass request.user as the owner if authenticated
        owner = None if request.user.is_anonymous else request.user
        
        repo = RepoService.create_repository(name=name, url=url, owner=owner)
        serializer = self.get_serializer(repo)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def upload(self, request):
        name = request.data.get('name')
        zip_file = request.FILES.get('file')

        if not name or not zip_file:
            return Response({"error": "Name and zip file are required."}, status=status.HTTP_400_BAD_REQUEST)

        if not zip_file.name.endswith('.zip'):
            return Response({"error": "Only .zip files are supported."}, status=status.HTTP_400_BAD_REQUEST)

        # ── Security: Enforce a 50MB max upload size ──
        MAX_ZIP_SIZE_BYTES = 50 * 1024 * 1024  # 50 MB
        if zip_file.size > MAX_ZIP_SIZE_BYTES:
            return Response(
                {"error": "File size exceeds the 50MB limit. Please upload a smaller archive."},
                status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            )

        owner = None if request.user.is_anonymous else request.user

        try:
            repo = RepoService.upload_and_extract_repository(name, zip_file, owner)
            serializer = self.get_serializer(repo)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, *args, **kwargs):
        try:
            RepoService.delete_repository(kwargs.get('pk'))
            return Response(status=status.HTTP_204_NO_CONTENT)
        except RepositoryNotFound as e:
            return Response(e.to_dict(), status=e.status_code)

    @action(detail=True, methods=['get'])
    def graph(self, request, pk=None):
        """
        Returns the generated knowledge graph JSON for this repository.
        """
        repo = self.get_object()
        
        if not repo.local_path:
            return Response(
                {"error": "Repository has no local path."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        graph_path = os.path.join(repo.local_path, 'knowledge_graph.json')
        
        if not os.path.exists(graph_path):
            return Response(
                {"error": "Knowledge graph not found for this repository. It may still be processing or failed."}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
        try:
            with open(graph_path, 'r', encoding='utf-8') as f:
                graph_data = json.load(f)
            return Response(graph_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": f"Failed to read knowledge graph: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class BranchViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        repo_id = self.request.query_params.get('repository')
        if repo_id:
            queryset = queryset.filter(repository_id=repo_id)
        return queryset

class CommitViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Commit.objects.all()
    serializer_class = CommitSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        repo_id = self.request.query_params.get('repository')
        if repo_id:
            queryset = queryset.filter(repository_id=repo_id)
        return queryset

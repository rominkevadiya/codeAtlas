from rest_framework import serializers
from apps.repositories.models import Repository, Branch, Commit

class RepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Repository
        fields = ['id', 'name', 'url', 'owner', 'is_cloned', 'local_path', 'default_branch', 'created_at', 'updated_at']
        read_only_fields = ['id', 'owner', 'is_cloned', 'local_path', 'created_at', 'updated_at']

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'repository', 'name', 'is_default', 'created_at', 'updated_at']

class CommitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commit
        fields = ['id', 'repository', 'hash', 'message', 'author_name', 'author_email', 'timestamp', 'created_at']

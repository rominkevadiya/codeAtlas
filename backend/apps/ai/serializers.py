from rest_framework import serializers

class AIQuerySerializer(serializers.Serializer):
    repository_id = serializers.UUIDField(required=True, help_text="The ID of the repository to query")
    query = serializers.CharField(required=True, max_length=2000, help_text="The natural language question about the codebase")

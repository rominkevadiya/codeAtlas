from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.ai.serializers import AIQuerySerializer
from apps.ai.services import AIService
from apps.ai.throttles import AIQueryAnonThrottle, AIQueryUserThrottle


class AIQueryView(APIView):
    """
    API endpoint to query a repository using Gemini AI.
    Rate-limited to prevent Gemini API quota abuse.
    """
    throttle_classes = [AIQueryAnonThrottle, AIQueryUserThrottle]

    def post(self, request, *args, **kwargs):
        serializer = AIQuerySerializer(data=request.data)
        if serializer.is_valid():
            repository_id = serializer.validated_data['repository_id']
            query = serializer.validated_data['query']

            try:
                answer = AIService.query_repository(repository_id=str(repository_id), query=query)
                return Response({"answer": answer}, status=status.HTTP_200_OK)
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": "An internal server error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

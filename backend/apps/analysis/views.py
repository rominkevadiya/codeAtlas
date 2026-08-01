from rest_framework.views import APIView
from rest_framework.response import Response
from apps.analysis.services import MetricsService
from apps.analysis.serializers import MetricsResponseSerializer
from apps.common.exceptions import CodeAtlasException

class AnalysisView(APIView):
    def get(self, request, repository_id):
        metrics = MetricsService.calculate_metrics(repository_id)
        serializer = MetricsResponseSerializer(metrics)
        return Response(serializer.data)

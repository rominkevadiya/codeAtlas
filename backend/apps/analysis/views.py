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

class ImpactAnalysisView(APIView):
    def get(self, request, repository_id):
        node_id = request.query_params.get('node_id')
        if not node_id:
            raise CodeAtlasException("node_id query parameter is required", code="MISSING_PARAM", status_code=400)
            
        impact = MetricsService.calculate_blast_radius(repository_id, node_id)
        return Response(impact)

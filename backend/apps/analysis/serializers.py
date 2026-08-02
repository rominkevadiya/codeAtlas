from rest_framework import serializers

class FileMetricSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    loc = serializers.IntegerField()
    contains_count = serializers.IntegerField()

class CouplingMetricSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    inbound_imports = serializers.IntegerField()
    outbound_imports = serializers.IntegerField()
    total_coupling = serializers.IntegerField()

class HotspotMetricSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    score = serializers.FloatField()

class DeadCodeMetricSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()

class MetricsResponseSerializer(serializers.Serializer):
    top_giant_files = FileMetricSerializer(many=True)
    top_coupled_files = CouplingMetricSerializer(many=True)
    circular_dependencies = serializers.ListField(
        child=serializers.ListField(child=serializers.CharField())
    )
    architectural_hotspots = HotspotMetricSerializer(many=True, required=False)
    dead_code_candidates = DeadCodeMetricSerializer(many=True, required=False)

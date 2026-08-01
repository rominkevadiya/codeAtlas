from django.urls import path
from .views import AnalysisView, ImpactAnalysisView

urlpatterns = [
    path('<uuid:repository_id>/', AnalysisView.as_view(), name='repository-analysis'),
    path('<uuid:repository_id>/impact/', ImpactAnalysisView.as_view(), name='repository-impact-analysis'),
]

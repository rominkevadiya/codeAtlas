from django.urls import path
from .views import AnalysisView

urlpatterns = [
    path('<uuid:repository_id>/', AnalysisView.as_view(), name='repository-analysis'),
]

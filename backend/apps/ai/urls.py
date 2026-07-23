from django.urls import path
from apps.ai.views import AIQueryView

urlpatterns = [
    path('query/', AIQueryView.as_view(), name='ai-query'),
]

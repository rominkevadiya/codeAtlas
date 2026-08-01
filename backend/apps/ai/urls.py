from django.urls import path
from apps.ai.views import AIQueryView, AIExplainNodeView

urlpatterns = [
    path('query/', AIQueryView.as_view(), name='ai-query'),
    path('explain/', AIExplainNodeView.as_view(), name='ai-explain-node'),
]

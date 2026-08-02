from django.urls import path
from apps.ai.views import (
    AIQueryView,
    AIExplainNodeView,
    ChatSessionListCreateView,
    ChatSessionDetailView,
    ChatSendMessageView,
)

urlpatterns = [
    path('query/', AIQueryView.as_view(), name='ai-query'),
    path('explain/', AIExplainNodeView.as_view(), name='ai-explain-node'),
    # Chat history endpoints
    path('chat/', ChatSessionListCreateView.as_view(), name='chat-session-list-create'),
    path('chat/<uuid:session_id>/', ChatSessionDetailView.as_view(), name='chat-session-detail'),
    path('chat/<uuid:session_id>/send/', ChatSendMessageView.as_view(), name='chat-send-message'),
]

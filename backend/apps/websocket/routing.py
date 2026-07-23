from django.urls import re_path
from apps.websocket import consumers

websocket_urlpatterns = [
    re_path(r'ws/repositories/(?P<repo_id>[^/]+)/progress/$', consumers.RepositoryProgressConsumer.as_asgi()),
]

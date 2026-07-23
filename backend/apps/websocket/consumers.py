import json
from channels.generic.websocket import AsyncWebsocketConsumer

class RepositoryProgressConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for streaming real-time repository parsing and extraction progress updates.
    """
    async def connect(self):
        self.repo_id = self.scope['url_route']['kwargs']['repo_id']
        self.group_name = f"repo_progress_{self.repo_id}"

        # Join repo progress channel group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave repo group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def repo_progress(self, event):
        """
        Handler for group messages sent via channel layer.
        """
        await self.send(text_data=json.dumps({
            'repo_id': event.get('repo_id'),
            'status': event.get('status'),
            'progress': event.get('progress', 0),
            'message': event.get('message', ''),
            'error': event.get('error', None)
        }))

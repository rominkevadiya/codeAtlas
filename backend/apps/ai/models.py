from django.db import models
from django.contrib.auth import get_user_model
from apps.common.models import UUIDModel, TimeStampedModel

User = get_user_model()


class ChatSession(UUIDModel, TimeStampedModel):
    """
    A named conversation session between a user and the AI for a specific repository.
    One user can have multiple sessions per repository.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_sessions')
    repository_id = models.CharField(max_length=255, db_index=True)
    title = models.CharField(max_length=255, default='New Chat')

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.user.username} - {self.repository_id[:8]} - {self.title}"


class ChatMessage(UUIDModel, TimeStampedModel):
    """
    A single message in a ChatSession. Role is either 'user' or 'assistant'.
    """
    class Role(models.TextChoices):
        USER = 'user', 'User'
        ASSISTANT = 'assistant', 'Assistant'

    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=16, choices=Role.choices)
    content = models.TextField()

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"[{self.role}] {self.content[:60]}"

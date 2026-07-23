from django.db import models
from apps.common.models import UUIDModel, TimeStampedModel
from django.contrib.auth import get_user_model

User = get_user_model()

class RepositoryStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending'
    EXTRACTING = 'EXTRACTING', 'Extracting ZIP'
    PARSING = 'PARSING', 'Parsing AST'
    BUILDING_GRAPH = 'BUILDING_GRAPH', 'Building Knowledge Graph'
    READY = 'READY', 'Ready'
    FAILED = 'FAILED', 'Failed'


class Repository(UUIDModel, TimeStampedModel):
    """
    Represents a Git repository cloned and managed by CodeAtlas.
    """
    name = models.CharField(max_length=255)
    url = models.URLField(max_length=1024, help_text="Git URL (HTTPS or SSH)")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="repositories", null=True, blank=True) # Making it optional for now
    is_cloned = models.BooleanField(default=False)
    local_path = models.CharField(max_length=1024, blank=True, null=True, help_text="Local disk path to the cloned repo")
    default_branch = models.CharField(max_length=255, default='main')
    status = models.CharField(
        max_length=32,
        choices=RepositoryStatus.choices,
        default=RepositoryStatus.READY,
    )
    error_message = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Branch(UUIDModel, TimeStampedModel):
    """
    Represents a branch within a Repository.
    """
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE, related_name="branches")
    name = models.CharField(max_length=255)
    is_default = models.BooleanField(default=False)

    class Meta:
        unique_together = ('repository', 'name')

    def __str__(self):
        return f"{self.repository.name} - {self.name}"

class Commit(UUIDModel, TimeStampedModel):
    """
    Represents a specific commit parsed for analysis.
    """
    repository = models.ForeignKey(Repository, on_delete=models.CASCADE, related_name="commits")
    hash = models.CharField(max_length=40, help_text="Git commit hash")
    message = models.TextField(blank=True)
    author_name = models.CharField(max_length=255, blank=True)
    author_email = models.CharField(max_length=255, blank=True)
    timestamp = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('repository', 'hash')

    def __str__(self):
        return f"{self.repository.name} - {self.hash[:7]}"

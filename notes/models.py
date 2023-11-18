from django.db import models

from labels.models import Label
from user.models import User


# Create your models here.
class Note(models.Model):
    title = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    color = models.CharField(max_length=255, null=True, blank=True)
    image = models.ImageField(upload_to='GoogleKeep/src/assets/noteImages', null=True, blank=True)
    remainder = models.DateTimeField(null=True)
    is_archive = models.BooleanField(default=False, null=True, blank=True)
    is_trash = models.BooleanField(default=False, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    collaborator = models.ManyToManyField(User, related_name="collaborator")
    label = models.ManyToManyField(Label, related_name="label")

    def __str__(self):
        return str(self.title)

    class Meta:
        db_table = "note"

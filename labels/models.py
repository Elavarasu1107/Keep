from django.db import models
from user.models import User


# Create your models here.
class Label(models.Model):
    title = models.CharField(max_length=255)
    color = models.CharField(max_length=255, null=True)
    font = models.CharField(max_length=255, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.title)

    class Meta:
        db_table = 'label'

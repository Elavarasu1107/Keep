from django.core import serializers
from django.db.models.signals import post_save
from django.dispatch import receiver

from utils.remainder import set_remainder

from .models import Note


@receiver(post_save, sender=Note)
def scheduler(instance: Note, **kwargs):
    if instance.remainder:
        set_remainder(instance)

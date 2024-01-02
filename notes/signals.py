import os

from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from utils.remainder import set_remainder

from .models import Note


@receiver(post_save, sender=Note)
def scheduler(instance: Note, **kwargs):
    if instance.remainder:
        set_remainder(instance)


@receiver(pre_save, sender=Note)
def delete_file_on_change(sender, instance, **kwargs):
    if instance.pk:  # If this is not a new instance
        try:
            old_file = Note.objects.get(pk=instance.pk).image
        except Note.DoesNotExist:
            return False

        if not old_file == instance.image:  # If image field is being changed
            if old_file:  # If the old image field is not empty
                if os.path.isfile(old_file.path):
                    os.remove(old_file.path)


@receiver(post_delete, sender=Note)
def delete_file_on_delete(sender, instance, **kwargs):
    if instance.image:  # If the instance being deleted has an image
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)

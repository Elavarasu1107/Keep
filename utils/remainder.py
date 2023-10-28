import json
from datetime import datetime, timedelta

from dateutil import parser
from django_celery_beat.models import CrontabSchedule, PeriodicTask


def set_remainder(instance):
    current_date = datetime.now()
    time_data = instance.remainder
    remainder_date = time_data.date()
    no_of_days = (remainder_date - current_date.date()).days
    remainder_time = current_date + timedelta(days=no_of_days)
    crontab, created = CrontabSchedule.objects.get_or_create(
        hour=time_data.hour,
        minute=time_data.minute,
        day_of_month=remainder_time.day,
        month_of_year=time_data.month,
    )
    periodic_tasks = PeriodicTask.objects.filter(
        name=f"For note {instance.title} {instance.id} and user {instance.user.email}"
    )
    if periodic_tasks.exists():
        periodic_tasks = periodic_tasks.first()
        periodic_tasks.crontab = crontab
        periodic_tasks.save()
    else:
        PeriodicTask.objects.create(
            name=f"For note {instance.title} {instance.id} and user {instance.user.email}",
            crontab=crontab,
            task="notes.tasks.send_remainder",
            args=json.dumps([instance.title, instance.user.email]),
        )

import os
from celery import Celery
from dotenv import load_dotenv

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'google_keep.settings')

app = Celery('google_keep')

load_dotenv()

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

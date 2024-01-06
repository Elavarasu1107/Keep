from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail


@shared_task(bind=True)
def celery_send_email(self, subject, message, email):
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
    )
    return f"Email sent to {email}"

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail


@shared_task(bind=True)
def send_remainder(self, subject, email):
    send_mail(
        subject="Google Keep Remainder",
        message=f"Check the note that you have created {subject}",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
    )
    return f"Email sent to {email}"

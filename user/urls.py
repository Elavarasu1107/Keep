from django.urls import path

from . import views

urlpatterns = [
    path(
        "api/registration/", views.UserRegistration.as_view({"post": "create", "get": "list"}), name="registration"
    ),
    path("api/login/", views.UserLogin.as_view({"post": "create"}), name="login"),
    path("api/logout/", views.logout_user, name="logout"),
]

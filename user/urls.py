from django.urls import path

from . import views

urlpatterns = [
    path(
        "registration/",
        views.UserRegistration.as_view({"post": "create", "get": "list"}),
        name="registration",
    ),
    path("login/", views.UserLogin.as_view({"post": "create"}), name="login"),
    path("logout/", views.logout_user, name="logout"),
]

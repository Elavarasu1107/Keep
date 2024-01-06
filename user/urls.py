from django.urls import path

from . import views

urlpatterns = [
    path(
        "registration/",
        views.UserRegistration.as_view({"post": "create", "get": "list"}),
        name="registration",
    ),
    path("login/", views.UserLogin.as_view({"post": "create"}), name="login"),
    path(
        "forgotPassword/",
        views.UserLogin.as_view({"post": "forgot_password"}),
        name="forgotPassword",
    ),
    path(
        "resetPassword/", views.UserLogin.as_view({"post": "reset_password"}), name="resetPassword"
    ),
    path("logout/", views.logout_user, name="logout"),
]

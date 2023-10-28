from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import User


# Register your models here.
class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    readonly_fields = ("date_joined", "last_login")
    list_display = ("email", "is_staff")
    ordering = ("email",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (("Personal info"), {"fields": ("first_name", "last_name", "mobile")}),
        (
            ("Permissions"),
            {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")},
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "first_name",
                    "last_name",
                    "mobile",
                    "is_staff",
                    "is_active",
                    "is_superuser",
                ),
            },
        ),
    )


admin.site.register(User, UserAdmin)

from django.urls import path

from . import views

urlpatterns = [
    path(
        "",
        views.Notes.as_view(
            {"post": "create", "get": "list", "put": "update", "delete": "destroy"}
        ),
        name="notes",
    ),
    path(
        "archive/",
        views.Notes.as_view({"get": "archive_data", "put": "to_archive"}, name="archive"),
    ),
    path(
        "trash/",
        views.Notes.as_view({"get": "trash_data", "put": "to_trash"}, name="trash"),
    ),
    path(
        "collaborator/",
        views.Notes.as_view(
            {"post": "add_collaborator", "delete": "delete_collaborator"}, name="collaborator"
        ),
    ),
]

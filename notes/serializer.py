from rest_framework import serializers

from labels.models import Label
from user.models import User

from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField("get_label_name")
    collaborator = serializers.SerializerMethodField("get_collaborator_name")

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "description",
            "color",
            "remainder",
            "is_archive",
            "is_trash",
            "user",
            "collaborator",
            "label",
            "image"
        ]
        read_only_fields = ["collaborator", "label", "user"]

    def get_label_name(self, note):
        return note.label.values_list("title", flat=True)

    def get_collaborator_name(self, note):
        return note.collaborator.values_list("email", flat=True)

    def create(self, validated_data):
        validated_data.update({"user": self.initial_data.get("user")})
        note: Note = Note.objects.create(**validated_data)
        labels = self.initial_data.get("label", None)
        collaborators = self.initial_data.get("collaborator", None)
        if labels:
            for label in labels:
                try:
                    label_obj = Label.objects.get(title=label, user=validated_data.get("user"))
                except:
                    label_obj = Label.objects.create(title=label, user=validated_data.get("user"))
                note.label.add(label_obj)
        if collaborators:
            for collaborator in collaborators:
                try:
                    collaborator_obj = User.objects.get(email=collaborator)
                    note.collaborator.add(collaborator_obj)
                except:
                    pass
        return note


class UpdateNoteSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=True)

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "description",
            "color",
            "remainder",
            "is_archive",
            "is_trash",
            "user",
            "collaborator",
            "label",
        ]
        read_only_fields = ["collaborator", "label", "user"]

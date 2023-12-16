from django.shortcuts import redirect, render
from django.views.generic import View
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from labels.models import Label
from user.models import User
from user.utils import CsrfExemptSessionAuthentication
from utils.exception_log import set_logger
from utils.redis_cache import RedisManager

from .models import Note
from .serializer import NoteSerializer, UpdateNoteSerializer

# Create your views here.
logger = set_logger()


class Notes(viewsets.ViewSet):
    serializer_class = NoteSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication, CsrfExemptSessionAuthentication)
    redis_instance = RedisManager()

    def get_parsers(self):
        content_type = self.request.content_type
        if content_type == "multipart/form-data":
            return [MultiPartParser()]
        elif content_type == "application/json":
            return [JSONParser()]
        return super().get_parsers()

    def convert_form_data_to_dict(self):
        data = {}
        for key, value in self.request.data.items():
            if key == "remainder" and value == "null":
                data.update({"remainder": None})
            elif key in ["is_archive", "is_trash"]:
                if value == "false":
                    data.update({key: False})
                else:
                    data.update({key: True})
            elif key in ["collaborator", "label"]:
                if value != "":
                    data.update({key: value.split(",")})
                else:
                    data.update({key: []})
            else:
                data.update({key: value})
        return data

    @swagger_auto_schema(request_body=NoteSerializer)
    def create(self, request):
        try:
            request.data.update({"user": request.user})
            data = request.data.copy()
            if "multipart/form-data" in request.content_type:
                data = self.convert_form_data_to_dict()
            serializer = NoteSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            # self.redis_instance.hset_notes(request.user.id, serializer.data)
            return Response(
                {"message": "Note Created", "status": 201, "data": serializer.data}, status=201
            )
        except Exception as ex:
            logger.exception(ex.args[0])
            return Response({"message": ex.args[0], "status": 400, "data": {}}, status=400)

    def list(self, request):
        try:
            # redis_data = self.redis_instance.hget_notes_user(request.user.id)
            # if redis_data:
            #     redis_data.sort(key=lambda x: x.get('id'), reverse=True)
            #     return Response(
            #         {"message": "Cache Notes Retrieved", "status": 200, "data": redis_data}, status=200
            #     )
            if request.query_params.get("fetch") == "remainder":
                notes = Note.objects.filter(user=request.user.id, remainder__isnull=False).order_by(
                    "-id"
                )
            else:
                notes = Note.objects.filter(
                    user=request.user.id, is_archive=False, is_trash=False
                ).order_by("-id")
            serializer = NoteSerializer(notes, many=True)
            return Response(
                {"message": "Notes Retrieved", "status": 200, "data": serializer.data}, status=200
            )
        except Exception as ex:
            return Response({"message": ex.args[0], "status": 400, "data": {}}, status=400)

    @swagger_auto_schema(request_body=UpdateNoteSerializer)
    def update(self, request):
        try:
            request.data.update({"user": request.user.id})
            data = request.data.copy()
            if "multipart/form-data" in request.content_type:
                data = self.convert_form_data_to_dict()
            note = Note.objects.get(
                id=request.query_params.get("id"), user=request.data.get("user")
            )
            serializer = NoteSerializer(note, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            # self.redis_instance.hset_notes(request.user.id, serializer.data)
            return Response(
                {"message": "Note Updated", "status": 200, "data": serializer.data}, status=200
            )
        except Exception as ex:
            return Response({"message": ex.args[0], "status": 400, "data": {}}, status=400)

    @swagger_auto_schema(
        manual_parameters=[openapi.Parameter("id", in_=openapi.IN_QUERY, type=openapi.TYPE_INTEGER)]
    )
    def destroy(self, request):
        try:
            if request.query_params.get("delete_all") == "true":
                Note.objects.filter(is_trash=True, user=request.user.id).delete()
            else:
                Note.objects.get(id=request.query_params.get("id"), user=request.user.id).delete()
                # self.redis_instance.hdel_notes(request.user.id, request.query_params.get("id"))
            return Response({"message": "Note Deleted", "status": 200, "data": {}}, status=200)
        except Exception as ex:
            return Response({"message": ex.args[0], "status": 400, "data": {}}, status=400)

    @swagger_auto_schema(
        manual_parameters=[openapi.Parameter("id", in_=openapi.IN_QUERY, type=openapi.TYPE_INTEGER)]
    )
    @action(methods=["PUT"], detail=True)
    def to_archive(self, request):
        try:
            note = Note.objects.get(id=request.query_params.get("id"), user=request.user.id)
            note.is_archive = True if not note.is_archive else False
            note.save()
            return Response({"message": "Note Archived", "status": 200, "data": {}}, status=200)
        except Exception as ex:
            return Response({"message": ex.args[0], "status": 400, "data": {}}, status=400)

    @swagger_auto_schema(
        manual_parameters=[openapi.Parameter("id", in_=openapi.IN_QUERY, type=openapi.TYPE_INTEGER)]
    )
    @action(methods=["PUT"], detail=True)
    def to_trash(self, request):
        try:
            note = Note.objects.get(id=request.query_params.get("id"), user=request.user.id)
            note.is_trash = True if not note.is_trash else False
            note.save()
            return Response(
                {"message": "Note Moved to trash", "status": 200, "data": {}}, status=200
            )
        except Exception as ex:
            return Response({"message": ex.args[0], "status": 400, "data": {}}, status=400)

    @action(methods=["GET"], detail=True)
    def archive_data(self, request):
        try:
            notes = Note.objects.filter(is_archive=True, user=request.user.id)
            serializer = NoteSerializer(notes, many=True)
            return Response(
                {"message": "Retrieved archived notes", "status": 200, "data": serializer.data},
                status=200,
            )
        except Exception as ex:
            return Response({"message": ex.args[0], "status": 400, "data": {}}, status=400)

    @action(methods=["GET"], detail=True)
    def trash_data(self, request):
        try:
            notes = Note.objects.filter(is_trash=True, user=request.user.id).order_by("-id")
            serializer = NoteSerializer(notes, many=True)
            return Response(
                {"message": "Retrieved trash notes", "status": 200, "data": serializer.data},
                status=200,
            )
        except Exception as ex:
            return Response({"message": ex.args[0], "status": 400, "data": {}}, status=400)

    @action(methods=["POST"], detail=True)
    def add_collaborator(self, request):
        try:
            note = Note.objects.get(id=request.data.get("id"), user=request.user.id)
            for email in request.data.get("collaborator"):
                collaborator = User.objects.get(email=email)
                note.collaborator.add(collaborator)
            return Response(
                {"message": "Collaborators added to the note", "status": 200, "data": {}},
                status=200,
            )
        except Exception as ex:
            return Response({"message": ex.args[0], "status": 400, "data": {}}, status=400)

    @action(methods=["PUT"], detail=True)
    def delete_collaborator(self, request):
        try:
            note = Note.objects.get(id=request.data.get("id"), user=request.user.id)
            collaborator = User.objects.get(email=request.data.get("collaborator"))
            note.collaborator.remove(collaborator)
            return Response(
                {"message": "Collaborator Removed", "status": 200, "data": {}},
                status=200,
            )
        except Exception as ex:
            return Response({"message": ex.args[0], "status": 400, "data": {}}, status=400)

    @action(methods=["POST"], detail=True)
    def add_label(self, request):
        try:
            note = Note.objects.get(id=request.data.get("id"), user=request.user.id)
            for lab in request.data.get("label"):
                label = Label.objects.get(title=lab)
                note.label.add(label)
            return Response(
                {"message": "Labels added to the note", "status": 200, "data": {}},
                status=200,
            )
        except Exception as ex:
            return Response({"message": ex.args[0], "status": 400, "data": {}}, status=400)

    @action(methods=["PUT"], detail=True)
    def delete_label(self, request):
        try:
            note = Note.objects.get(id=request.data.get("id"), user=request.user.id)
            label = Label.objects.get(title=request.data.get("label"))
            note.label.remove(label)
            return Response(
                {"message": "Label Removed", "status": 200, "data": {}},
                status=200,
            )
        except Exception as ex:
            return Response({"message": ex.args[0], "status": 400, "data": {}}, status=400)


class NotesView(View):
    def get(self, request):
        if request.user.is_authenticated:
            return render(request, "home.html")
        return redirect("login.html")

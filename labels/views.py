from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializer import LabelSerializer, UpdateLabelSerializer
from user.utils import CsrfExemptSessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from .models import Label
from drf_yasg.utils import swagger_auto_schema
from utils.redis_cache import RedisManager
from drf_yasg import openapi


# Create your views here.
class Labels(viewsets.ViewSet):
    serializer_class = LabelSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication, CsrfExemptSessionAuthentication)
    redis_instance = RedisManager()

    @swagger_auto_schema(request_body=LabelSerializer)
    def create(self, request):
        try:
            request.data.update({'user': request.user})
            serializer = LabelSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            # self.redis_instance.save(serializer.data, request.user.id)
            return Response({'message': 'Label Created', 'status': 201, 'data': serializer.data}, status=201)
        except Exception as ex:
            return Response({'message': ex.args[0], 'status': 400, 'data': {}}, status=400)

    def list(self, request):
        try:
            # redis_data = self.redis_instance.get(request.user.id)
            # if redis_data:
            #     return Response({'message': 'Label Retrieved', 'status': 200, 'data': redis_data}, status=200)
            notes = Label.objects.filter(user=request.user.id)
            serializer = LabelSerializer(notes, many=True)
            return Response({'message': 'Label Retrieved', 'status': 200, 'data': serializer.data}, status=200)
        except Exception as ex:
            return Response({'message': ex.args[0], 'status': 400, 'data': {}}, status=400)

    @swagger_auto_schema(request_body=UpdateLabelSerializer)
    def update(self, request):
        try:
            request.data.update({'user': request.user.id})
            note = Label.objects.get(id=request.query_params.get('id'), user=request.data.get('user'))
            serializer = LabelSerializer(note, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            # self.redis_instance.save(serializer.data, request.user.id)
            return Response({'message': 'Label Updated', 'status': 201, 'data': serializer.data}, status=201)
        except Exception as ex:
            return Response({'message': ex.args[0], 'status': 400, 'data': {}}, status=400)

    @swagger_auto_schema(manual_parameters=[openapi.Parameter('id', in_=openapi.IN_QUERY, type=openapi.TYPE_INTEGER)])
    def destroy(self, request):
        try:
            Label.objects.get(id=request.query_params.get('id'), user=request.user.id).delete()
            # self.redis_instance.delete(request.query_params.get('id'), request.user.id)
            return Response({'message': 'Label Deleted', 'status': 200, 'data': {}}, status=200)
        except Exception as ex:
            return Response({'message': ex.args[0], 'status': 400, 'data': {}}, status=400)

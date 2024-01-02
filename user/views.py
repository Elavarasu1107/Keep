from datetime import datetime, timedelta
from os import environ

import jwt
from django.contrib.auth import authenticate, login, logout
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework_simplejwt.tokens import RefreshToken

from utils.exception_log import logger
from utils.tasks import celery_send_email

from .models import User
from .serializer import LoginSerializer, RegisterSerializer

# Create your views here.


class UserRegistration(viewsets.ViewSet):
    serializer_class = RegisterSerializer
    authentication_classes = ()

    def create(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(
                {"message": "User Registered", "status": 201, "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        except Exception as ex:
            return Response({"message": ex.args[0], "status": 400, "data": {}}, status=400)

    def list(self, request):
        try:
            users = User.objects.all().values_list("email", flat=True)
            # serializer = RegisterSerializer(users, many=True)
            return Response(
                {"message": "Users Retrieved", "status": 200, "data": users},
                status=status.HTTP_200_OK,
            )
        except Exception as ex:
            return Response({"message": ex.args[0], "status": 400, "data": {}}, status=400)


class UserLogin(viewsets.ViewSet):
    serializer_class = LoginSerializer
    authentication_classes = ()
    permission_classes = ()

    def create(self, request):
        try:
            serializer = LoginSerializer(data=request.data, context=request)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            token = RefreshToken.for_user(serializer.instance)
            return Response(
                {
                    "message": "Logged in Successfully",
                    "status": 200,
                    "data": {
                        "access": str(token.access_token),
                        "refresh": str(token),
                        "user": serializer.data,
                    },
                },
                status=status.HTTP_200_OK,
            )
        except Exception as ex:
            return Response({"message": ex.args[0], "status": 400, "data": {}}, status=400)

    @action(methods=["POST"], detail=True)
    def forgot_password(self, request):
        try:
            user = User.objects.get(email=request.data.get("email"))
            token = jwt.encode(
                {
                    "email": user.email,
                    "exp": datetime.utcnow() + timedelta(hours=1),
                    "aud": "resetPassword",
                },
                key=environ.get("SECRET_KEY"),
                algorithm=environ.get("JWT_ALGORITHM"),
            )
            url = environ.get("BASE_URL") + reverse("resetPassword") + f"?token={token}"
            celery_send_email.delay("Reset Password", url, user.email)
            return Response(
                {"message": f"Reset password link send to {user.email}", "status": 200}, status=200
            )
        except User.DoesNotExist:
            return Response({"message": "User not found", "status": 404, "data": {}}, status=404)
        except Exception as ex:
            return Response({"message": ex.args[0], "status": 400, "data": {}}, status=400)

    @action(methods=["POST"], detail=True)
    def reset_password(self, request):
        try:
            new_password = request.data.get("new_password")
            confirm_passowrd = request.data.get("confirm_password")
            if new_password != confirm_passowrd:
                raise NotFound("Password mismatch", code=404)
            token = request.query_params.get("token")
            if not token:
                raise NotFound("Token required", code=404)
            data = jwt.decode(
                token,
                key=environ.get("SECRET_KEY"),
                audience="resetPassword",
                algorithms=[environ.get("JWT_ALGORITHM")],
            )
            user = User.objects.get(email=data.get("email"))
            user.set_password(new_password)
            user.save()
            return Response(
                {"message": "Password reset password successful", "status": 200}, status=200
            )
        except User.DoesNotExist:
            return Response({"message": "User not found", "status": 404, "data": {}}, status=404)
        except Exception as ex:
            return Response({"message": ex.args[0], "status": 400, "data": {}}, status=400)


@api_view(["GET"])
def logout_user(request):
    logout(request)
    return Response({"message": "Logged out Successfully", "status": 201, "data": {}}, status=200)

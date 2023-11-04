import requests
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect, render
from django.views.generic import View
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework_simplejwt.tokens import RefreshToken
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
                {"message": "Logged in Successfully", "status": 200, "data": {
                    'access': str(token.access_token),
                    'refresh': str(token)
                }},
                status=status.HTTP_200_OK,
            )
        except Exception as ex:
            return Response({"message": ex.args[0], "status": 400, "data": {}}, status=400)


@api_view(["GET"])
def logout_user(request):
    logout(request)
    return Response({"message": "Logged out Successfully", "status": 201, "data": {}}, status=200)


class LoginView(View):
    authentication_classes = ()

    def get(self, request):
        return render(request, "login.html")

    def post(self, request):
        user = authenticate(email=request.POST.get("email"), password=request.POST.get("password"))
        if user:
            login(request, user)
            return redirect("home")
        return render(request, "login.html")

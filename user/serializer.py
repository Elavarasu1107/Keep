from django.contrib.auth import authenticate, login
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "password", "first_name", "last_name", "mobile", "location")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.object.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(max_length=255, write_only=True)

    def create(self, validated_data):
        user = authenticate(**validated_data)
        if not user:
            raise AuthenticationFailed("Invalid Credentials")
        login(self.context, user)
        return user

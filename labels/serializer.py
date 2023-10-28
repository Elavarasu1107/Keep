from rest_framework import serializers
from .models import Label
from django.db import IntegrityError


class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['id', 'title', 'color', 'font', 'user']
        read_only_fields = ['user']

    def create(self, validated_data):
        validated_data.update({'user': self.initial_data.get('user')})
        label = Label.objects.filter(title=validated_data.get('title'), user=validated_data.get('user'))
        if label.exists():
            raise IntegrityError(f'Object with name {validated_data.get("title")} already exists for '
                                 f'{validated_data.get("user").email}')
        return Label.objects.create(**validated_data)


class UpdateLabelSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=True)

    class Meta:
        model = Label
        fields = ['id', 'title', 'color', 'font', 'user']
        read_only_fields = ['user']

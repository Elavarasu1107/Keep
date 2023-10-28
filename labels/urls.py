from django.urls import path
from . import views

urlpatterns = [
    path('', views.Labels.as_view({'post': 'create', 'get': 'list', 'put': 'update', 'delete': 'destroy'}),
         name='labels'),
]

from django.urls import path
from .views import PromptViewSet
from rest_framework import routers
from django.urls import include

router = routers.DefaultRouter()
router.register(r'prompts', PromptViewSet)

urlpatterns = [
    path('', include(router.urls)),
]


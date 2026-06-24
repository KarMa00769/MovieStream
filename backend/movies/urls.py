from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MovieViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r'', MovieViewSet, basename='movie')

urlpatterns = [
    path('', include(router.urls)),
]

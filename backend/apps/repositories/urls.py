from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.repositories import views

router = DefaultRouter()
router.register(r'repositories', views.RepositoryViewSet, basename='repository')
router.register(r'branches', views.BranchViewSet, basename='branch')
router.register(r'commits', views.CommitViewSet, basename='commit')

urlpatterns = [
    path('', include(router.urls)),
]

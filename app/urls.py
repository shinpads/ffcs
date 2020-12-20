from django.urls import path
from .views import views, teamviews

urlpatterns = [
  path('api/get_team/<str:data>/', teamviews.get_team),
  path('api/post_team/<str:data>/', teamviews.post_team),
  path('', views.index),
]

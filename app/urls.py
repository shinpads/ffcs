from django.urls import path
from .views import views, teamviews, playerviews, seasonviews

urlpatterns = [
  path('api/season/', seasonviews.SeasonView.as_view()),
  path('api/team/', teamviews.TeamView.as_view()),
  path('api/player/', playerviews.PlayerView.as_view()),
  path('api/admin/player/', playerviews.AssignPlayerToTeam.as_view()),
  path('', views.index),
]

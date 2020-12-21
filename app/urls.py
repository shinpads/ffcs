from django.urls import path
from .views import views, teamviews, playerviews, seasonviews

urlpatterns = [
  path('api/season/', seasonviews.SeasonView.as_view()),
  path('api/team_by_name/', teamviews.TeamView.as_view()),
  path('api/team_by_id/', teamviews.TeamByIdView.as_view()),
  path('api/player/', playerviews.PlayerView.as_view()),
  path('api/add_player_to_team/', playerviews.AssignPlayerToTeam.as_view()),
  path('', views.index),
]

from django.urls import path
from .views import views, teamviews, playerviews, seasonviews, matchviews

urlpatterns = [
  path('api/season/', seasonviews.SeasonView.as_view()),
  path('api/team/', teamviews.TeamView.as_view()),
  path('api/player/', playerviews.PlayerView.as_view()),
  path('api/match/', matchviews.MatchView.as_view()),
  path('api/matches/', matchviews.MatchesView.as_view()),
  path('api/admin/player/assignteam/', playerviews.AssignPlayerToTeam.as_view()),
  path('api/admin/player/assignrole/', playerviews.ChangePlayerRole.as_view()),
  path('', views.index),
]

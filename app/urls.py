from django.urls import path
from .views import views, gameviews, teamviews, playerviews, seasonviews

urlpatterns = [
  path('api/season/', seasonviews.SeasonView.as_view()),
  path('api/team/', teamviews.TeamView.as_view()),
  path('api/player/', playerviews.PlayerView.as_view()),
  path('api/admin/player/assignteam/', playerviews.AssignPlayerToTeam.as_view()),
  path('api/admin/player/assignrole/', playerviews.ChangePlayerRole.as_view()),
  path('', views.index),
  path('api/tournamentcallback/', gameviews.CallbackView.as_view())
]

from django.urls import path
from .views import views, teamviews, playerviews, seasonviews, matchviews, gameviews, discordviews, registrationviews, userviews

urlpatterns = [
  path('api/season/', seasonviews.SeasonView.as_view()),
  path('api/team/', teamviews.TeamView.as_view()),
  path('api/player/', playerviews.PlayerView.as_view()),
  path('api/match/', matchviews.MatchView.as_view()),
  path('api/matches/', matchviews.MatchesView.as_view()),
  path('api/admin/player/assignteam/', playerviews.AssignPlayerToTeam.as_view()),
  path('api/admin/player/assignrole/', playerviews.ChangePlayerRole.as_view()),
  path('api/signup/', registrationviews.signup),
  path('api/user/from-session/', userviews.get_from_session, name='get_user_from_session'),
  path('', views.index),
  path('signup', views.signup_index),
  path('/riot.txt', views.riot),
  path('api/tournamentcallback/', gameviews.CallbackView.as_view()),
  path('oauth2/login/', discordviews.discord_login, name='oauth_login'),
  path('oauth2/login/redirect/', discordviews.login_redirect, name='oauth_login_redirect'),
]

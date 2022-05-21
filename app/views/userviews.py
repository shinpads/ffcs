from app.discord_utils import update_user_info, test_mvp
from app.utils import format_user_for_frontend
from ..models import Player, Team, Season, User, Match, Game
from ..serializers.userserializer import UserSerializer
from ..serializers.userprofileserializer import UserProfileSerializer
from ..serializers.matchserializer import MatchSerializer
from ..serializers.game_serializer_with_match import GameSerializerWithMatch
from django.http import JsonResponse
from django.views import View
from django.db import IntegrityError
from ..scripts import player_stats
import json, os
import requests

def get_from_session(request):
    user = request.user
    try:
        update_user_info(user)
    except AttributeError:
        print("Error updating user info")
    if user.is_anonymous:
        return JsonResponse({
            "message": "not logged in",
            "data": None
        }, status=200)

    out_data = UserSerializer(user).data
    format_user_for_frontend(out_data)
    test_mvp()

    return JsonResponse({
        "message": "success",
        "data": out_data,
    }, status=200)


def get_user(request, user_id):
    user = User.objects.filter(pk=user_id).prefetch_related('players').get()
    current_season_id = Season.objects.get(is_current=True).id
    try:
        update_user_info(user)
    except AttributeError:
        print("Error updating user info")
    user_data = UserProfileSerializer(user).data
    matches = Match.objects.filter(teams__in=[player.team for player in user.players.all()]).prefetch_related('teams').prefetch_related('teams__players')
    games = Game.objects.filter(match__in=[match.id for match in matches], winner__isnull=False, game_data__isnull=False).order_by('-match__scheduled_for')
    games_data = GameSerializerWithMatch(games, many=True).data


    return JsonResponse({
        "message": "success",
        "data": {
            "user": user_data,
            "games": games_data,
            "currentSeason": current_season_id,
        }
    }, status=200)



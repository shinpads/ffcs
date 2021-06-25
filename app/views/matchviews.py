from ..models import Match
from ..utils import get_game
from ..serializers.matchserializer import MatchSerializer
from django.http import JsonResponse
from django.db import IntegrityError
from django.views import View
import json

class MatchesView(View):
    def get(self, request, *args, **kwargs):
        matches = Match.objects.all() \
        .order_by('scheduled_for', '-week') \
        .prefetch_related('games') \
        .prefetch_related('teams') \
        .prefetch_related('teams__player_set') \
        .prefetch_related('teams__player_set__stats') \
        .prefetch_related('teams__player_set__player_champion_stats') \

        out_data = MatchSerializer(matches, many=True).data

        return JsonResponse({
            "message": "success",
            "data": out_data,
        }, status=200)


def get_match(request, match_id):
    match = Match.objects.get(pk=match_id)
    match_data = MatchSerializer(match).data

    game_datas = [get_game(game['game_id'], game['tournament_code']) for game in match_data['games']]
    # game_data = get_game(game_id)
    # print(game_data)
    return JsonResponse({
        "message": "success",
        "data": {
            "match": match_data,
            "game_datas": game_datas
        }
    })

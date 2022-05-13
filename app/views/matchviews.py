from ..models import Match
from ..utils.utils import get_game, get_game_timeline
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
        .prefetch_related('teams__players') \
        .prefetch_related('teams__players__stats') \
        .prefetch_related('teams__players__player_champion_stats') \

        out_data = MatchSerializer(matches, many=True).data

        return JsonResponse({
            "message": "success",
            "data": out_data,
        }, status=200)


def get_match(request, match_id):
    match = Match.objects.get(pk=match_id)
    match_data = MatchSerializer(match).data

    game_datas = [get_game(game['game_id'], game['tournament_code']) for game in match_data['games']]
    game_timelines = [get_game_timeline(game['game_id']) for game in match_data['games']]

    game_datas = []

    for game in match_data['games']:
        game_data = get_game(game['game_id'], game['tournament_code'])
        game_timeline = get_game_timeline(game['game_id'])
        game_data['timeline'] = game_timeline
        game_datas.append(game_data)

    return JsonResponse({
        "message": "success",
        "data": {
            "match": match_data,
            "game_datas": game_datas,
        }
    })

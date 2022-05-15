from ..models import Match, Season, Team
from ..utils import get_game, get_game_timeline
from ..serializers.matchserializer import MatchSerializer
from django.http import JsonResponse
from django.db import IntegrityError
from django.views import View
import json

class MatchesView(View):
    def get(self, request, *args, **kwargs):
        current_season_id = Season.objects.get(is_current=True).id
        matches = Match.objects.all() \
        .order_by('scheduled_for', '-week') \
        .prefetch_related('games') \
        .prefetch_related('teams') \
        .prefetch_related('teams__captain') \
        .prefetch_related('teams__players') \
        .prefetch_related('teams__players__stats') \
        .prefetch_related('teams__players__player_champion_stats') \
        
        out_data = {}
        out_data['matches'] = MatchSerializer(matches, many=True).data
        out_data['current_season_id'] = current_season_id

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

def propose_schedule(request, team_id, match_id, proposed_time):
    team = Team.objects.get(id=team_id)
    match = Match.objects.get(id=match_id)
    
    if match == None:
        response = JsonResponse({
            "message": "could not find match with id: " + match_id,
            "data": {},
        }, status=500)
        return response
    
    if team == None:
        response = JsonResponse({
            "message": "could not find team with id: " + team_id,
            "data": {},
        }, status=500)
        return response

    if (request.user.id != team.captain.user.id) and not request.user.is_admin:
        response = JsonResponse({
            "message": "you are not authorized to perform this request.",
            "data": {},
        }, status=401)
        return response
    

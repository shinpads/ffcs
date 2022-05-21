from datetime import datetime

from app.discord_utils import send_game_confirmation_dm
from ..models import Match, Season, Team, User
from ..utils import get_game, get_game_timeline
from ..serializers.matchserializer import MatchSerializer
from django.http import JsonResponse
from django.db import IntegrityError
from django.views import View
import json
import pytz

class MatchesView(View):
    def get(self, request, *args, **kwargs):
        current_season_id = Season.objects.get(is_current=True).id
        matches = Match.objects.all() \
        .order_by('scheduled_for', '-week') \
        .prefetch_related('casters') \
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

def propose_schedule(request):
    data = json.loads(request.body)
    proposed_date_epoch = int(str(data['date'])[:-3])
    proposed_date = datetime.fromtimestamp(proposed_date_epoch)
    est = pytz.timezone('US/Eastern')
    proposed_date = proposed_date.astimezone(est)
    from_team_id = data.get('sendingTeamId')
    match_id = data.get('matchId')

    try:
        team = Team.objects.get(id=from_team_id)
    except:
        response = JsonResponse({
            "message": "There was an error finding the team.",
            "data": {},
        }, status=500)
        return response
    
    try:
        match = Match.objects.get(id=match_id)
    except:
        response = JsonResponse({
            "message": "There was an error finding the match.",
            "data": {},
        }, status=500)
        return response

    if (request.user.id != team.captain.user.id) and not request.user.is_admin:
        response = JsonResponse({
            "message": "you are not authorized to perform this request.",
            "data": {},
        }, status=401)
        return response
    
    if match.proposed_for != None:
        response = JsonResponse({
            "message": "There is already a proposed date for this match! Please wait for that date to be confirmed or denied.",
            "data": {},
        }, status=500)
        return response
    
    match.proposed_for = proposed_date
    match.save()

    to_team_id = None
    for team in match.teams.all():
        if team.id != from_team_id:
            to_team_id = team.id
            break

    try:
        send_game_confirmation_dm(from_team_id, to_team_id, match_id)
        response = JsonResponse({
            "message": "Successfully proposed the date! Please wait for the enemy captain to confirm.",
            "data": {},
        }, status=200)
        return response
    except:
        response = JsonResponse({
            "message": "An error occured sending the confirmation message.",
            "data": {},
        }, status=500)
        return response

def update_casters(request):
    data = json.loads(request.body)
    match = Match.objects.get(id=data['matchId'])
    user = User.objects.get(id=data['userId'])

    if user in match.casters.all():
        match.casters.remove(user)
    else:
        match.casters.add(user)
    
    match.save()

    out_data = {}
    out_data['casters'] = MatchSerializer(match).data['casters']

    response = JsonResponse({
            "message": "Successfully updated casters.",
            "data": out_data
        }, status=200)
    return response
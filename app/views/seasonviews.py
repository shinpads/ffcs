from ..models import Season, Match
from ..serializers.seasonserializer import SeasonSerializer
from ..serializers.matchserializer import MatchSerializer
from ..serializers.teamserializer import TeamSerializer
from django.core import serializers
from django.http import JsonResponse, HttpRequest
from django.db import IntegrityError
from django.views import View
import json

class SeasonView(View):

    def get(self, request, *args, **kwargs):
        out_data = {}
        season_num  = request.GET.get('season', None)
        season_name = request.GET.get('season_name', None)
        season = None
        if season_num != None:
            season = Season.objects.filter(number=season_num).first()
        elif season_name != None:
            season = Season.objects.filter(name=season_name).first()
        if season == None:
            response = JsonResponse({
                "message": "could not find season with given number.",
                "data": {},
            }, status=500)
            return response

        out_data = SeasonSerializer(season).data

        response = JsonResponse({
            "message": "successfully found the season.",
            "data": out_data,
        }, status=200)
        return response

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        out_data = {}
        season_num = data['season']

        season = Season()
        season.number = season_num
        try:
            season.save()
        except IntegrityError as e:
            response = JsonResponse({
                "message": "An error has occured.",
                "error": e.args[0],
                "data": {},
            }, status=500)
            return response

        out_data = SeasonSerializer(season).data

        response = JsonResponse({
            "message": "Successfully created season.",
            "data": out_data,
        }, status=200)
        return response

def standings(request: HttpRequest):
    season_num = request.GET['season']
    season = Season.objects.get(number=season_num)
    matches = Match.objects.filter(season=season).prefetch_related('teams')
    standings = {}

    for match in matches:
        teams = match.teams.all()
        if len(teams) < 2:
            print('THERE SHOULD BE EXACTLY 2 TEAMS!')
            continue
        for team in teams:
            if not team.id in standings.keys():
                standings[team.id] = {'gp': 0, 'w': 0, 'l': 0, 'team': TeamSerializer(team).data}
            if match.winner != None:
                standings[team.id]['gp'] += 1
                if match.winner.id == team.id:
                    standings[team.id]['w'] += 1
                else:
                    standings[team.id]['l'] += 1


    return JsonResponse({
        "success": True,
        "data": [standings[team_id] for team_id in standings.keys()],
    })

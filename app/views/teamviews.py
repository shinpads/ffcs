from ..models import Team, Season
from ..serializers.teamserializer import TeamSerializer
from django.http import JsonResponse
from django.views import View
from django.core import serializers
from django.db import IntegrityError
import json


class TeamByIdView(View):

    def get(self, request, *args, **kwargs):
        data = json.loads(request.body)
        team_id = data['id']

        team = Team.objects.get(pk=team_id)
        if team == None:
            response = JsonResponse({
                "message": "could not find the team specified.",
                "data": {},
            }, status=500)
            return response
        
        out_data = TeamSerializer(team).data

        response = JsonResponse({
            "message": "successfully retrieved team from database.",
            "data": out_data,
        }, status=200)

        return response


class TeamView(View):
    
    def get(self, request, *args, **kwargs):
        data = json.loads(request.body)
        team_name = data['team_name']
        season_num = data['season']

        season = Season.objects.filter(number=season_num).first()
        if season == None:
            response = JsonResponse({
                "message": "could not find the season specified.",
                "data": {},
            }, status=500)
            return response

        team = season.team_set.filter(name=team_name).first()
        if team == None:
            response = JsonResponse({
                "message": "could not find the team in the specified season.",
                "data": {},
            }, status=500)
            return response

        out_data = TeamSerializer(team).data

        response = JsonResponse({
            "message": "successfully retrieved team from database.",
            "data": out_data,
        }, status=200)

        return response

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        team_name = data['team_name']
        season_num = data['season']

        season = Season.objects.filter(number=season_num).first()

        if season == None:
            response = JsonResponse({
                "message": "could not find the specified season.",
                "data": {},
            }, status=500)
            return response

        new_team = Team()
        new_team.name = team_name
        new_team.season = season

        try:
            new_team.save()
        except IntegrityError as e:
            response = JsonResponse({
                "message": "That team already exists in the specified season.",
                "error": e.args[0],
                "data": {},
            }, status=500)
            return response

        out_data = TeamSerializer(new_team).data

        response = JsonResponse({
            "message": "successfully added a new team to the database.",
            "data": out_data,
        }, status=200)

        return response
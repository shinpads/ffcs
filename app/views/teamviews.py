from app.discord_utils import update_team_discord_info
from ..models import Player, Team, Season
from ..serializers.teamserializer import TeamSerializer
from django.http import JsonResponse
from django.views import View
from django.core import serializers
from django.db import IntegrityError
import json

class TeamView(View):

    def get(self, request, *args, **kwargs):
        data = request.GET
        user_id = request.user.id
        multi_team = False

        if "id" in data:
            team_id = data["id"]
            team = Team.objects.get(pk=team_id)
            if team == None:
                response = JsonResponse({
                    "message": "could not find the team specified.",
                    "data": {},
                }, status=500)
                return response

        elif "team_name" in data and "season_num" in data:
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
                    "message": ("could not find the team in "
                                "the specified season."),
                    "data": {},
                }, status=500)
                return response

        elif "currentSeasonTeams" in data and data['currentSeasonTeams']:
            current_season = Season.objects.get(is_current=True)
            if current_season == None:
                response = JsonResponse({
                    "message": "There is no current season.",
                    "data": {},
                }, status=500)
                return response
            
            teams = Team.objects.all().filter(season=current_season)
            if teams == None:
                response = JsonResponse({
                    "message": "There are no teams in the current season.",
                    "data": {},
                }, status=500)
                return response
            
            multi_team = True

        else:
            response = JsonResponse({
                "message": ("Invalid request. Please specify "
                            "an 'id', or a 'team_name' and 'season', or "
                            "set currentSeasonTeams to true."),
                "data": {},
            }, status=500)
            return response

        

        if multi_team:
            out_data = [TeamSerializer(team).data for team in teams]
        else:
            out_data = TeamSerializer(team).data
            if team.captain:
                out_data['is_captain'] = (team.captain.user.id == user_id)
            else:
                out_data['is_captain'] = False
            out_data['is_captain'] |= request.user.is_admin

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

    def patch(self, request, *args, **kwargs):
        data = json.loads(request.body)

        team = Team.objects.get(id=data['id'])
        if team == None:
                response = JsonResponse({
                    "message": "could not find team with id: " + data['id'],
                    "data": {},
                }, status=500)
                return response

        if (request.user.id != team.captain.user.id) and not request.user.is_admin:
            response = JsonResponse({
                "message": "you are not authorized to perform this request.",
                "data": {},
            }, status=401)
            return response

        for player in data['players']:
            player_obj = Player.objects.get(id=player['id'])
            if player_obj == None:
                response = JsonResponse({
                    "message": "could not find player with id: " + player['id'],
                    "data": {},
                }, status=500)
                return response
            player_obj.role = player['role']
            player_obj.save()
        
        if data['color'] != team.color:
            update_team_discord_info(data['id'], data['players'], {'color': data['color']})
        
        team.color = data['color']
        team.save()
        
        out_data = {'success': True}
        response = JsonResponse({
            "message": "successfully updated team.",
            "data": out_data,
        }, status=200)

        return response

        
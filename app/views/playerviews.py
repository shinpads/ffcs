from ..models import Player, Team, Season
from ..serializers.teamserializer import TeamSerializer
from ..serializers.playerserializer import PlayerSerializer
from django.http import JsonResponse
from django.views import View
from django.db import IntegrityError
from dotenv import load_dotenv
import json, os
import requests

load_dotenv()

def get_riot_account_id(username):
    url = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"
    url = url + username + "?api_key=" + os.getenv('RIOT_API_KEY')
    res = json.loads(requests.get(url).text)
    account_id = res['accountId']

    return account_id


class ChangePlayerRole(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        out_data = {}
        role = data['role']

        if 'username' in data:
            username = data['username']
            try:
                account_id = get_riot_account_id(username)
            except:
                response = JsonResponse({
                    "message": "error finding player in Riot API.",
                    "data": {},
                }, status=500)
                return response

            player = Player.objects.filter(account_id=account_id).first()
            if player == None:
                response = JsonResponse({
                    "message": "could not find player in database.",
                    "data": {},
                }, status=500)
                return response

        elif 'player_id' in data:
            player_id = data['player_id']
            player = Player.objects.get(pk=team_id)
            if player == None:
                response = JsonResponse({
                    "message": "could not find player in database.",
                    "data": {},
                }, status=500)
                return response

        else:
            response = JsonResponse({
                "message": "please request with 'player_id' or 'username'.",
                "data": {},
            }, status=500)
            return response

        player.role = role
        player.save()


        player_data = PlayerSerializer(player).data

        response = JsonResponse({
            "message": "successfully changed player role.",
            "data": out_data,
        })

        return response


class AssignPlayerToTeam(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        out_data = {}

        if 'username' in data:
            username = data['username']
            try:
                account_id = get_riot_account_id(username)
            except:
                response = JsonResponse({
                    "message": "error finding player in Riot API.",
                    "data": {},
                }, status=500)
                return response

            player = Player.objects.filter(account_id=account_id).first()
            if player == None:
                response = JsonResponse({
                    "message": "could not find player in database.",
                    "data": {},
                }, status=500)
                return response

        elif 'player_id' in data:
            player_id = data['player_id']
            player = Player.objects.get(pk=team_id)
            if player == None:
                response = JsonResponse({
                    "message": "could not find player in database.",
                    "data": {},
                }, status=500)
                return response

        else:
            response = JsonResponse({
                "message": "please request with 'player_id' or 'username'.",
                "data": {},
            }, status=500)
            return response

        if 'team_id' in data:
            team_id = data['team_id']
            team = Team.objects.get(pk=team_id)
            if team == None:
                response = JsonResponse({
                    "message": "could not find the team specified.",
                    "data": {},
                }, status=500)
                return response

        elif 'season' in data and 'team_name' in data:
            season_num = data['season']
            team_name = data['team_name']

            season = Season.objects.filter(number=season_num).first()
            if season == None:
                response = JsonResponse({
                    "message": "could not find season with given number.",
                    "data": {},
                }, status=500)
                return response

            team = season.team_set.filter(name=team_name).first()
            if team == None:
                response = JsonResponse({
                    "message": "could not find team in the given season.",
                    "data": {},
                }, status=500)
                return response

        player.team = team
        player.save()

        out_data = TeamSerializer(team).data

        response = JsonResponse({
            "message": "successfully added player to team.",
            "data": out_data,
        })

        return response


class PlayerView(View):

    def get(self, request, *args, **kwargs):
        data = request.GET
        out_data = {}

        if 'id' in data:
            player_id = data["id"]
            player = Player.objects.get(pk=player_id)
            if player == None:
                response = JsonResponse({
                    "message": "could not find the player specified.",
                    "data": {},
                }, status=500)
                return response

        if 'username' in data:
            username = data['username']
            try:
                account_id = get_riot_account_id(username)
            except:
                response = JsonResponse({
                    "message": "error finding player in Riot API.",
                    "data": {},
                }, status=500)
                return response

            player = Player.objects.filter(account_id=account_id).first()
            if player == None:
                response = JsonResponse({
                    "message": "could not find player in database.",
                    "data": {},
                }, status=500)
                return response

        out_data = PlayerSerializer(player).data

        response = JsonResponse({
            "message": "successfully retrieved player from database.",
            "data": out_data,
        }, status=200)

        return response

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        out_data = {}
        username = data['username']
        try:
            account_id = get_riot_account_id(username)
        except:
            response = JsonResponse({
                "message": "error finding player in Riot API.",
                "data": {},
            }, status=500)
            return response

        new_player = Player()
        new_player.username = str(username)
        new_player.account_id = str(account_id)
        if 'role' in data:
            new_player.role = data['role']
        try:
            new_player.save()
        except IntegrityError as e:
            response = JsonResponse({
                "message": "That player already exists.",
                "error": e.args[0],
                "data": {},
            }, status=500)
            return response

        out_data = PlayerSerializer(new_player).data

        response = JsonResponse({
            "message": "successfully added player to database.",
            "data": out_data,
        }, status=200)

        return response

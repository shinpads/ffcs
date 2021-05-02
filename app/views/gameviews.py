from django.http import JsonResponse
from django.views import View
from ..models import Game, Player
from ..utils import get_riot_account_id
import json

class CallbackView(View):

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        out_data = {}

        game_id = data["gameId"]
        print(data)
        meta_key = json.loads(data["metaData"])["key"]
        
        game = Game.objects.filter(meta_key=meta_key).first()
        if game == None:
            response = JsonResponse({
                "message": "Could not find game.",
                "data": out_data,
            }, status=500)
            return response

        winner_acc_username = data["winningTeam"][0]["summonerName"]
        winner_acc_id = get_riot_account_id(winner_acc_username)
        winner_player = Player.objects.filter(account_id=winner_acc_id).first()
        if winner_player == None:
            response = JsonResponse({
                "message": "Error finding player.",
                "data": out_data,
            }, status=500)
            return response
        
        winner_team = winner_player.team
        if winner_team == None:
            response = JsonResponse({
                "message": "Player does not have a team.",
                "data": out_data,
            }, status=500)
            return response

        if game.winner != None or game.game_id != '':
            response = JsonResponse({
                "message": "That game has already been updated.",
                "data": out_data,
            }, status=500)
            return response

        game.winner = winner_team
        game.game_id = game_id
        game.save()
        

        response = JsonResponse({
            "message": "Successfully recieved callback.",
            "data": out_data,
        }, status=200)
        return response


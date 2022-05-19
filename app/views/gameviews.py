from django.http import JsonResponse
from django.views import View
from ..models import Game, Player, Season
from ..utils import get_riot_account_id
from ..scripts import player_stats
from ..utils import get_game_timeline
import json


class CallbackView(View):

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        out_data = {}

        game_id = data["gameId"]

        temp_meta = eval(data["metaData"])
        meta_key = temp_meta["key"]

        game = Game.objects.filter(meta_key=meta_key).first()
        if game == None:
            response = JsonResponse({
                "message": "Could not find game.",
                "data": out_data,
            }, status=500)
            return response

        winner_acc_username = data["winningTeam"][0]["summonerName"]
        winner_acc_id = get_riot_account_id(winner_acc_username)
        current_season = Season.objects.get(is_current=True)
        winner_player = Player.objects.filter(account_id=winner_acc_id, team__season=current_season).first()
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

        # update player stats with new data
        player_stats.calculate_player_stats()

        response = JsonResponse({
            "message": "Successfully recieved callback.",
            "data": out_data,
        }, status=200)
        return response


def get_timeline(request, game_id):
    timeline = get_game_timeline(game_id)

    return JsonResponse({
        "message": "success",
        "data": {
            "timeline": timeline,
        }
    })

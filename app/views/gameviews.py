from django.http import JsonResponse
from django.views import View

from app.discord_utils import send_mvp_vote_dm
from ..models import Game, Match, Player, Season
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

        current_season = Season.objects.get(is_current=True)
        winner_team = None

        winning_players = []

        for i in range(5):
            winner_acc_username = data["winningTeam"][i]["summonerName"]
            winner_acc_id = get_riot_account_id(winner_acc_username)

            winner_player = Player.objects.filter(account_id=winner_acc_id, team__season=current_season).first()

            if winner_player == None:
                continue

            winning_players.append(winner_player)

            player_team = winner_player.team
            if player_team == None:
                continue

            if player_team.id in [team.id for team in game.match.teams.all()]:
                winner_team = player_team
                break

        if game.winner != None or game.game_id != '':
            response = JsonResponse({
                "message": "That game has already been updated.",
                "data": out_data,
            }, status=500)
            return response
        
        if winner_team == None:
            response = JsonResponse({
                "message": "Found no winning team!",
                "data": out_data,
            }, status=500)
            return response

        game.winner = winner_team
        game.game_id = game_id
        game.save()

        # update player stats with new data
        player_stats.calculate_player_stats()

        send_mvp_vote_dm(game.match, winning_players)

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

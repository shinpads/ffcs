from django.http import JsonResponse
from django.views import View

from app.discord_utils import send_mvp_vote_dm
from ..models import Game, Match, Player, Rank, Season, User
from ..utils import get_riot_account_id, get_rumble_player_games
from ..rank_utils import adjust_player_lp_and_rank_on_loss, adjust_player_lp_and_rank_on_win, calculate_lp_loss, get_win_or_loss_streak
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

        for i in range(len(data["losingTeam"])):
            loser_acc_username = data["losingTeam"][i]["summonerName"]
            loser_acc_id = get_riot_account_id(loser_acc_username)

            try:
                loser_user = User.objects.get(summoner_id=loser_acc_id)
                loser_player = None

                for player in loser_user.players.all():
                    if player.is_rumble and current_season.is_rumble:
                        loser_player = player
                        break
                    elif player.team.season.id == current_season.id:
                        loser_player = player
                        break
            except:
                print('error finding loser player.')
                continue

            if loser_player == None:
                continue

            try:
                adjust_player_lp_and_rank_on_loss(loser_player)
                
            except:
                print('Error calculating LP for player...')
                continue


        for i in range(len(data["winningTeam"])):
            winner_acc_username = data["winningTeam"][i]["summonerName"]
            winner_acc_id = get_riot_account_id(winner_acc_username)
            
            try:
                winner_user = User.objects.get(summoner_id=winner_acc_id)
                winner_player = None

                for player in winner_user.players.all():
                    if player.is_rumble and current_season.is_rumble:
                        winner_player = player
                        break
                    elif player.team.season.id == current_season.id:
                        winner_player = player
                        break
            except:
                print('error finding winner player.')
                continue
            
            if winner_player == None:
                continue

            winning_players.append(winner_player)
            
            winner_team = None
            
            for team in game.match.teams.all():
                if player.is_rumble:
                    if player in [
                        team.rumble_top,
                        team.rumble_jg,
                        team.rumble_mid,
                        team.rumble_adc,
                        team.rumble_supp
                    ]:
                        winner_team = team
                        break
                else:
                    if player in team.players.all():
                        winner_team = team
                        break
            
            try:
                adjust_player_lp_and_rank_on_win(winner_player)
                
            except:
                print('Error calculating LP for player...')
                continue

        if game.winner != None:
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
        
        try:
            send_mvp_vote_dm(game, winning_players)
        except:
            print('failed sending MVP Vote DM.')

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

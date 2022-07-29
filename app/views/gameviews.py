import sys
from django.http import JsonResponse
from django.views import View

from app.discord_utils import send_mvp_vote_dm, send_rumble_rank_updates
from app.elo_utils import adjust_player_elo
from ..models import Game, Season, User
from ..utils import get_riot_account_id
from ..rank_utils import adjust_player_lp_on_loss, adjust_player_lp_on_win, update_all_rumble_ranks
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
            except Exception as e:
                print('error finding loser player.')
                print(str(e))
                sys.stdout.flush()
                continue

            if loser_player == None:
                continue

            loser_team = None
            
            for team in game.match.teams.all():
                if player.is_rumble:
                    if player in [
                        team.rumble_top,
                        team.rumble_jg,
                        team.rumble_mid,
                        team.rumble_adc,
                        team.rumble_supp
                    ]:
                        loser_team = team
                        break
                else:
                    if player in team.players.all():
                        loser_team = team
                        break

            try:
                loser_player = adjust_player_lp_on_loss(loser_player)
                loser_player = adjust_player_elo(loser_player, game, loser_team, False)
                
            except Exception as e:
                print('Error calculating LP and elo for player...')
                print(str(e))
                sys.stdout.flush()
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
            except Exception as e:
                print('error finding winner player.')
                print(str(e))
                sys.stdout.flush()
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
                winner_player = adjust_player_lp_on_win(winner_player)
                winner_player = adjust_player_elo(winner_player, game, winner_team, True)
                
            except Exception as e:
                print('Error calculating LP and elo for player...')
                print(str(e))
                sys.stdout.flush()
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
        
        try:
            update_all_rumble_ranks()
        except Exception as e:
            print('Error calculating LP for player...')
            print(str(e))
            sys.stdout.flush()

        game.winner = winner_team
        game.game_id = game_id
        game.save()
        
        try:
            send_mvp_vote_dm(game, winning_players)
        except Exception as e:
            print('failed sending MVP Vote DM.')
            print(str(e))
            sys.stdout.flush()

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

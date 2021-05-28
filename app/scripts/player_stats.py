from dotenv import load_dotenv
import os
import json
import requests
from ..models import Game, Player, Match, Season, PlayerStats
from ..utils import get_game

load_dotenv()

def calculate_player_stats():
    current_season = Season.objects.get(number=2)
    all_matches = Match.objects.filter(season=current_season)
    all_games = Game.objects.filter(match__in=all_matches).exclude(game_id='')
    game_datas = [get_game(game.game_id, game.tournament_code) for game in list(all_games)]

    player_stats = {}

    for game in game_datas:
        for participant in game['participants']:
            summoner_id = game['participantIdentities'][participant['participantId'] - 1]['player']['summonerId']
            if not summoner_id in player_stats:
                player = Player.objects.filter(account_id=summoner_id).select_related('team').filter(team__season=current_season)[0]
                player_stats[summoner_id], created = PlayerStats.objects.get_or_create(player=player)
                print(player_stats[summoner_id])
                # set defaults
                player_stats[summoner_id].games_played   = 0
                player_stats[summoner_id].kills          = 0
                player_stats[summoner_id].deaths         = 0
                player_stats[summoner_id].assists        = 0
                player_stats[summoner_id].kda_per_game   = 0
                player_stats[summoner_id].vision_per_min = 0
                player_stats[summoner_id].cc_per_game    = 0
                player_stats[summoner_id].cs_per_min     = 0
                player_stats[summoner_id].kp_per_game    = 0
                player_stats[summoner_id].damage_per_min = 0

            effective_deaths = participant['stats']['deaths'] if participant['stats']['deaths'] > 0 else 1
            total_team_kills = sum([p['stats']['kills'] for p in game['participants'] if p['teamId'] == participant['teamId']])

            player_stats[summoner_id].games_played   += 1
            player_stats[summoner_id].kills          += participant['stats']['kills']
            player_stats[summoner_id].deaths         += participant['stats']['deaths']
            player_stats[summoner_id].assists        += participant['stats']['assists']
            player_stats[summoner_id].kda_per_game   += (participant['stats']['kills'] + participant['stats']['assists']) / effective_deaths
            player_stats[summoner_id].vision_per_min += participant['stats']['visionScore'] / (game['gameDuration'] / 60)
            player_stats[summoner_id].cc_per_game    += participant['stats']['timeCCingOthers']
            player_stats[summoner_id].cs_per_min     += (participant['stats']['totalMinionsKilled'] + participant['stats']['neutralMinionsKilled']) / (game['gameDuration'] / 60)
            player_stats[summoner_id].kp_per_game    += ((participant['stats']['assists'] + participant['stats']['kills']) / total_team_kills) * 100
            player_stats[summoner_id].damage_per_min += participant['stats']['totalDamageDealtToChampions'] / (game['gameDuration'] / 60)


    # process and save player stats
    for summoner_id in player_stats.keys():
        player_stat = player_stats[summoner_id]
        player_stat.kda_per_game    /= player_stat.games_played
        player_stat.vision_per_min  /= player_stat.games_played
        player_stat.cc_per_game     /= player_stat.games_played
        player_stat.cs_per_min      /= player_stat.games_played
        player_stat.kp_per_game     /= player_stat.games_played
        player_stat.damage_per_min  /= player_stat.games_played
        player_stat.save()

from dotenv import load_dotenv
from decimal import Decimal
import os
import json
import requests
from ..models import Game, Player, Match, Season, PlayerStats, PlayerChampionStats
from ..utils import get_game

load_dotenv()

def calculate_player_stats():
    current_season = Season.objects.get(number=2)
    all_matches = Match.objects.filter(season=current_season)
    all_games = Game.objects.filter(match__in=all_matches).exclude(game_id='')
    game_datas = [get_game(game.game_id, game.tournament_code) for game in list(all_games)]

    ##########################
    #      PLAYER STATS     #
    #########################
    player_stats = {}
    for game in game_datas:
        for participant in game['participants']:
            summoner_id = game['participantIdentities'][participant['participantId'] - 1]['player']['summonerId']
            summoner_name = game['participantIdentities'][participant['participantId'] - 1]['player']['summonerName']
            summoner_icon = game['participantIdentities'][participant['participantId'] - 1]['player']['profileIcon']
            if not summoner_id in player_stats:
                players = Player.objects.filter(account_id=summoner_id).select_related('team').filter(team__season=current_season)
                if not len(players):
                    print('cant find player or team for player', summoner_name)
                    continue
                player = players[0]
                if player.profile_icon_id != summoner_icon:
                    print('updaing profile icon for', summoner_name)
                    player.profile_icon_id = summoner_icon
                    player.save()
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
                player_stats[summoner_id].damage_taken   = 0

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
            player_stats[summoner_id].damage_taken   += participant['stats']['totalDamageTaken']

    # process and save player stats
    for summoner_id in player_stats.keys():
        player_stat = player_stats[summoner_id]
        player_stat.kda_per_game    /= player_stat.games_played
        player_stat.vision_per_min  /= player_stat.games_played
        player_stat.cc_per_game     /= player_stat.games_played
        player_stat.cs_per_min      /= player_stat.games_played
        player_stat.kp_per_game     /= player_stat.games_played
        player_stat.damage_per_min  /= player_stat.games_played
        player_stat.kills           /= player_stat.games_played
        player_stat.assists         /= player_stat.games_played
        player_stat.deaths          /= player_stat.games_played
        player_stat.damage_taken    /= player_stat.games_played
        player_stat.save()


    ##########################
    # PLAYER CHAMPION STATS #
    #########################
    player_champion_stats = {}
    for game in game_datas:
        for participant in game['participants']:
            summoner_id     = game['participantIdentities'][participant['participantId'] - 1]['player']['summonerId']
            summoner_name   = game['participantIdentities'][participant['participantId'] - 1]['player']['summonerName']
            champion_id     = participant['championId']
            team            = game['teams'][int(participant['teamId'] / 100) - 1]

            key = (summoner_id, champion_id)
            if not key in player_champion_stats:
                players = Player.objects.filter(account_id=summoner_id).select_related('team').filter(team__season=current_season)
                if not len(players):
                    print('cant find player or team for player', summoner_name)
                    continue
                player = players[0]
                player_champion_stats[key], created = PlayerChampionStats.objects.get_or_create(player=player, champion_id=champion_id)
                print(player_champion_stats[key])
                # set defaults
                player_champion_stats[key].games_played   = 0
                player_champion_stats[key].kills          = 0
                player_champion_stats[key].deaths         = 0
                player_champion_stats[key].assists        = 0
                player_champion_stats[key].kda            = 0
                player_champion_stats[key].vision_per_min = 0
                player_champion_stats[key].cc             = 0
                player_champion_stats[key].cs_per_min     = 0
                player_champion_stats[key].kp             = 0
                player_champion_stats[key].damage_per_min = 0
                player_champion_stats[key].damage_taken   = 0
                player_champion_stats[key].wins           = 0
                player_champion_stats[key].losses         = 0

            effective_deaths = participant['stats']['deaths'] if participant['stats']['deaths'] > 0 else 1
            total_team_kills = sum([p['stats']['kills'] for p in game['participants'] if p['teamId'] == participant['teamId']])
            won = team['win'] == 'Win'

            player_champion_stats[key].games_played   += 1
            player_champion_stats[key].kills          += participant['stats']['kills']
            player_champion_stats[key].deaths         += participant['stats']['deaths']
            player_champion_stats[key].assists        += participant['stats']['assists']
            player_champion_stats[key].kda            += (participant['stats']['kills'] + participant['stats']['assists']) / effective_deaths
            player_champion_stats[key].vision_per_min += participant['stats']['visionScore'] / (game['gameDuration'] / 60)
            player_champion_stats[key].cc             += participant['stats']['timeCCingOthers']
            player_champion_stats[key].cs_per_min     += (participant['stats']['totalMinionsKilled'] + participant['stats']['neutralMinionsKilled']) / (game['gameDuration'] / 60)
            player_champion_stats[key].kp             += ((participant['stats']['assists'] + participant['stats']['kills']) / total_team_kills) * 100
            player_champion_stats[key].damage_per_min += participant['stats']['totalDamageDealtToChampions'] / (game['gameDuration'] / 60)
            player_champion_stats[key].damage_taken   += participant['stats']['totalDamageTaken']
            if won:
                player_champion_stats[key].wins           += 1
            else:
                player_champion_stats[key].losses         += 1

    # process and save player stats
    for key in player_champion_stats.keys():
        player_champion_stat = player_champion_stats[key]
        player_champion_stat.kda             /= player_champion_stat.games_played
        player_champion_stat.vision_per_min  /= player_champion_stat.games_played
        player_champion_stat.cc              /= player_champion_stat.games_played
        player_champion_stat.cs_per_min      /= player_champion_stat.games_played
        player_champion_stat.kp              /= player_champion_stat.games_played
        player_champion_stat.damage_per_min  /= player_champion_stat.games_played
        player_champion_stat.kills           /= player_champion_stat.games_played
        player_champion_stat.assists         /= player_champion_stat.games_played
        player_champion_stat.deaths          /= player_champion_stat.games_played
        player_champion_stat.damage_taken    /= player_champion_stat.games_played
        player_champion_stat.save()
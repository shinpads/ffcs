from dotenv import load_dotenv
import os
import json
import requests
from django.apps import apps
import sys

load_dotenv()

def get_riot_account_id(username):
    url = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"
    url = url + username.strip() + "?api_key=" + os.getenv('RIOT_API_KEY')

    res = requests.get(url)
    if res.status_code != 200:
        return None

    body = json.loads(res.text)
    account_id = body['id']

    return str(account_id)

def get_info_by_account_id(account_id):
    url = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/"
    url = url + account_id.strip() + "?api_key=" + os.getenv('RIOT_API_KEY')

    res = requests.get(url)
    print('response: ' + res.text)
    sys.stdout.flush()

    if res.status_code != 200:
        return None

    body = json.loads(res.text)
    return body

def register_tournament_provider():
    debug = os.getenv('DEBUG')
    if debug == "on":
        url = "https://americas.api.riotgames.com/lol/tournament-stub/v4/providers"
    else:
        url = "https://americas.api.riotgames.com/lol/tournament/v4/providers"
    url = url + "?api_key=" + os.getenv('RIOT_API_KEY')
    data = {
        "region": "NA",
        "url": "https://www.ffcsleague.com/api/tournamentcallback/"
    }

    res = (requests.post(url, data=json.dumps(data)))
    if res.status_code != 200:
        return None

    return str(res.text)

def register_tournament(name, provider_id):
    try:
        int(provider_id)
    except:
        return None

    debug = os.getenv('DEBUG')
    if debug == "on":
        url = "https://americas.api.riotgames.com/lol/tournament-stub/v4/tournaments"
    else:
        url = "https://americas.api.riotgames.com/lol/tournament/v4/tournaments"
    url = url + "?api_key=" + os.getenv('RIOT_API_KEY')
    data = {
        "name": name,
        "providerId": int(provider_id)
    }

    res = (requests.post(url, data=json.dumps(data)))
    if res.status_code != 200:
        return None

    return str(res.text)

def generate_tournament_code(game, all_players):
    summoners = []
    map_type = "SUMMONERS_RIFT"
    metadata = {}
    pick_type = "TOURNAMENT_DRAFT"
    spectator_type = "ALL"
    team_size = 5

    debug = os.getenv('DEBUG')
    if debug == "on":
        url = "https://americas.api.riotgames.com/lol/tournament-stub/v4/codes"
    else:
        url = "https://americas.api.riotgames.com/lol/tournament/v4/codes"
    url = url + "?count=1"
    url = url + "&tournamentId=" + game.match.season.tournament_id
    url = url + "&api_key=" + os.getenv('RIOT_API_KEY')

    if game.meta_key == '':
        return None
    else:
        metadata["key"] = game.meta_key

    for team in game.match.teams.all():
        for player in team.players.all():
            summoners.append(player.account_id)

    if len(summoners) < 10:
        return None

    for player in all_players.objects.filter(caster=True):
        if player.account_id not in summoners:
            summoners.append(player.account_id)

    data = {
        "allowedSummonerIds": summoners,
        "mapType": map_type,
        "metadata": str(metadata),
        "pickType": pick_type,
        "spectatorType": spectator_type,
        "teamSize": team_size
    }

    res = (requests.post(url, data=json.dumps(data)))

    if res.status_code != 200:
        return None

    code = json.loads(str(res.text))[0]

    return code

def get_game(gameid, tournament_code):
    Game = apps.get_model('app', 'Game')
    game = Game.objects.get(game_id=gameid)

    if game.game_data != None:
        print('Using cached game data')
        return game.game_data

    url = "https://na1.api.riotgames.com/lol/match/v4/matches/"
    url = url + gameid + "/by-tournament-code/" + tournament_code + "?api_key=" + os.getenv('RIOT_API_KEY')
    res = requests.get(url)
    if res.status_code != 200:
        return None

    body = json.loads(res.text)

    # save this to the game object
    game.game_data = body;
    game.save()

    return body

def get_game_timeline(gameid):
    #url = "https://na1.api.riotgames.com/lol/match/v4/timelines/by-match/"
    url = "https://na1.api.riotgames.com/lol/match/v5/matches/" + gameid + "/timeline"
    url = url + "?api_key=" + os.getenv('RIOT_API_KEY')

    res = requests.get(url)

    if res.status_code != 200:
        return None

    body = json.loads(res.text)

    return body

def format_user_for_frontend(data):
    data['discord_user_id'] = str(data['discord_user_id'])

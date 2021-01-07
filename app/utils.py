from dotenv import load_dotenv
import os
import json
import requests

load_dotenv()

def get_riot_account_id(username):
    url = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"
    url = url + username + "?api_key=" + os.getenv('RIOT_API_KEY')

    res = requests.get(url)
    if res.status_code != 200:
        return None

    body = json.loads(res.text)
    account_id = body['id']

    return str(account_id)

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
        print(res.text)
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
        for player in team.player_set.all():
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
        print(res.text)
        return None

    code = json.loads(str(res.text))[0]

    return code
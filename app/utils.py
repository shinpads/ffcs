from dotenv import load_dotenv
import os
import json
import requests

load_dotenv()

def get_riot_account_id(username):
    url = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"
    url = url + username + "?api_key=" + os.getenv('RIOT_API_KEY')

    res = json.loads(requests.get(url))
    if res.status_code != 200:
        return None

    body = res.text
    account_id = body['accountId']

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
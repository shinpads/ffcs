from dotenv import load_dotenv
import os
import json
import requests

load_dotenv()

def get_riot_account_id(username):
    try:
        url = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"
        url = url + username + "?api_key=" + os.getenv('RIOT_API_KEY')
        res = json.loads(requests.get(url).text)
        account_id = res['accountId']

        return str(account_id)
    except:
        return None

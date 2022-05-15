from django.http import HttpResponse, JsonResponse, HttpRequest
from django.views import View
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login
from app.discord_bot import DiscordBot

from app.discord_constants import InteractionCallbackTypes
from ..models import Match, Team, User, Season, RegistrationForm
import json
import requests
import os
import logging
from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError
from dotenv import load_dotenv
import pytz

logger = logging.getLogger(__name__)

DISCORD_AUTH_URL = os.getenv('DISCORD_AUTH_URL')
DISCORD_CLIENT_ID = os.getenv('DISCORD_CLIENT_ID')
DISCORD_CLIENT_SECRET = os.getenv('DISCORD_CLIENT_SECRET')
DISCORD_REDIRECT_URI = os.getenv('DISCORD_REDIRECT_URI')

load_dotenv()
discord_bot_token = os.getenv('DISCORD_BOT_TOKEN')
guild_id = os.getenv('DISCORD_GUILD_ID')
discord_bot = DiscordBot(discord_bot_token, guild_id)

class DiscordView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        headers = request.headers
        public_key = os.getenv('DISCORD_BOT_PUBLIC_KEY')

        try:
            verify_key = VerifyKey(bytes.fromhex(public_key))
        except:
            return HttpResponse(401, 'invalid request signature')

        signature = headers['X-Signature-Ed25519']
        timestamp = headers['X-Signature-Timestamp']
        body = request.body.decode("utf-8")

        try:
            verify_key.verify(f'{timestamp}{body}'.encode(), bytes.fromhex(signature))
        except:
            return HttpResponse(401, 'invalid request signature')
        
        if data['type'] == 1:
            return JsonResponse({
                "type": 1
            }, status=200)
        
        interaction_response = json.loads(data['data']['custom_id'])
        
        if interaction_response['i_type'] == 'match_confirm':
            return game_confirm_response(data, interaction_response)

        return JsonResponse({
                "status": "success"
            }, status=200)

def game_confirm_response(data, interaction_response):
    response_value = interaction_response['val']
    original_message = data['message']['content']
    from_team_id = interaction_response['f_id']
    to_team_id = interaction_response['to_id']
    match_id = interaction_response['m_id']
    match = Match.objects.get(id=match_id)
    from_team = Team.objects.get(id=from_team_id)
    to_team = Team.objects.get(id=to_team_id)
    from_team_captain = from_team.captain.user
    to_team_captain = to_team.captain.user
    est = pytz.timezone('US/Eastern')
    proposed_time = match.proposed_for.astimezone(est)
    

    if response_value:
        from_captain_message = (
            "The schedule you proposed for your game with **{}** at **{}** "
            "has been approved by the enemy captain, **{}**. Good luck, summoner!"
        ).format(
            to_team.name,
            proposed_time.strftime('%a, %B %d, %Y, at %I:%M %p EST'),
            to_team_captain.summoner_name,
        )
        discord_bot.send_dm(from_team_captain.discord_user_id, from_captain_message)

        match.scheduled_for = proposed_time
        match.proposed_for = None
        match.save()

        return JsonResponse({
            "type": InteractionCallbackTypes.UPDATE_MESSAGE,
            "data": {
                "content": (
                    "{}\n\n"
                    "Game has been successfully confirmed! Thank you :D"
                    ).format(original_message),
                "components": []
            }
        })
    else:
        # do stuff on false

        from_captain_message = (
            "The schedule you proposed for your game with **{}** at **{}** "
            "has been declined by the enemy captain, **{}**. Please propose a "
            "new time on the FFCS website that the enemy captain agrees with."
        ).format(
            to_team.name,
            proposed_time.strftime('%a, %B %d, %Y, at %I:%M %p EST'),
            to_team_captain.summoner_name,
        )
        discord_bot.send_dm(from_team_captain.discord_user_id, from_captain_message)

        match.proposed_for = None
        match.save()

        return JsonResponse({
            "type": InteractionCallbackTypes.UPDATE_MESSAGE,
            "data": {
                "content": (
                    "{}\n\n"
                    "Game will not be scheduled for that time. "
                    "Thank you for your response!"
                    ).format(original_message),
                "components": []
            }
        })


def discord_login(request: HttpRequest):
    if not request.session.session_key:
        request.session.save()

    return redirect(DISCORD_AUTH_URL)

def login_redirect(request: HttpRequest):
    code = request.GET['code']
    discord_user_data = exchange_code(code)
    user = authenticate(request, user=discord_user_data)
    login(request, user, backend='app.auth.DiscordAuthenticationBackend')

    return redirect('/')

def exchange_code(code: str):
    data = {
        'client_id': DISCORD_CLIENT_ID,
        'client_secret': DISCORD_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': DISCORD_REDIRECT_URI,
        'scope': 'identify email'
    }

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post('https://discord.com/api/oauth2/token', data=data, headers=headers)
    credentials = response.json();
    access_token = credentials['access_token']

    headers = {
        'Authorization': 'Bearer %s' % access_token
    }

    response = requests.get('https://discord.com/api/v6/users/@me', headers=headers)

    return response.json()

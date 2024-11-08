from datetime import timedelta
from io import BytesIO
from django.http import HttpResponse, JsonResponse, HttpRequest
from django.views import View
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login
from app.discord_bot import DiscordBot

from app.discord_constants import InteractionCallbackTypes, ScheduledEventEntityType
from app.image_utils import create_profile_image
from ..models import Game, Match, Player, Team, User, Season, RegistrationForm
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

        verify_key = VerifyKey(bytes.fromhex(public_key))

        signature = headers['X-Signature-Ed25519']
        timestamp = headers['X-Signature-Timestamp']
        body = request.body.decode("utf-8")

        try:
            verify_key.verify(
                f'{timestamp}{body}'.encode(), bytes.fromhex(signature)
            )
        except BadSignatureError:
            return HttpResponse(401, 'invalid request signature')

        if data['type'] == 1:
            return JsonResponse({
                "type": 1
            }, status=200)

        if data['data'].get('name', False) and data['data']['name'] == 'profile':
            return profile_slash_command_response(data)

        interaction_response = json.loads(data['data']['custom_id'])

        if interaction_response['i_type'] == 'match_confirm':
            return game_confirm_response(data, interaction_response)

        elif interaction_response['i_type'] == 'mvp_vote':
            return mvp_vote_response(
                data,
                interaction_response,
                data['data']['values'][0]
            )

        elif interaction_response['i_type'] == 'proposed_elo_confirm':
            elo_change = False
            return elo_confirm_response(
                data,
                interaction_response,
                elo_change
            )

        elif interaction_response['i_type'] == 'proposed_elo_change':
            elo_change = True
            return elo_confirm_response(
                data,
                interaction_response,
                elo_change,
                chosen_elo=data['data']['values'][0]
            )

        return JsonResponse({
            "status": "success"
        }, status=200)


def profile_slash_command_response(data):
    chosen_profile = data['data']['options'][0]['value']
    channel_id = data['channel_id']
    user = User.objects.get(summoner_name__iexact=chosen_profile)

    profile_image = create_profile_image(user)
    with BytesIO() as image_binary:
        profile_image.save(image_binary, 'PNG')
        image_binary.seek(0)
        files = {'file': (f'{user.summoner_name}.png', image_binary)}
        discord_bot.send_message('', channel_id, files=files)

    return JsonResponse({
        "type": InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE,
        "data": {
            "content": f"{user.summoner_name}'s profile: https://ffcsleague.com/user/{user.id}",
        }
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
            "has been approved by the enemy captain, **{}**. Good luck, "
            "summoner!"
        ).format(
            to_team.name,
            proposed_time.strftime('%a, %B %d, %Y, at %I:%M %p EST'),
            to_team_captain.summoner_name,
        )
        discord_bot.send_dm(
            from_team_captain.discord_user_id,
            from_captain_message
        )

        set_match_event(
            match,
            os.getenv('DISCORD_ANNOUNCEMENTS_CHANNEL'),
            proposed_time,
            match.event_id
        )

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
        discord_bot.send_dm(
            from_team_captain.discord_user_id,
            from_captain_message
        )

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


def mvp_vote_response(data, interaction_response, voted_player_id):
    num_of_voters = interaction_response['voters']
    original_message = data['message']['content']
    game_id = interaction_response['g_id']
    game = Game.objects.get(id=game_id)

    if voted_player_id not in game.mvp_votes.keys():
        game.mvp_votes[voted_player_id] = 0

    game.mvp_votes[voted_player_id] += 1
    game.save()

    if game.mvp != None:
        return JsonResponse({
            "type": InteractionCallbackTypes.UPDATE_MESSAGE,
            "data": {
                "content": (
                    "{}\n\n"
                    "Voting has already concluded. Thank you anyways!"
                ).format(original_message),
                "components": []
            }
        })

    if sum(game.mvp_votes.values()) >= num_of_voters:
        mvp_player_id = max(game.mvp_votes, key=game.mvp_votes.get)
        mvp_player = Player.objects.get(id=mvp_player_id)
        mvp_player.rumble_lp += 5
        game.mvp = mvp_player
        game.save()
        mvp_player.save()

        mvp_message = "**Congrats! You have been voted the Match MVP!** 🥳🎉"
        discord_bot.send_dm(mvp_player.user.discord_user_id, mvp_message)

    return JsonResponse({
        "type": InteractionCallbackTypes.UPDATE_MESSAGE,
        "data": {
            "content": (
                "{}\n\n"
                "Thank you for voting!"
            ).format(original_message),
            "components": []
        }
    })


def elo_confirm_response(
        data,
        interaction_response,
        is_elo_change,
        chosen_elo=None):
    original_message = data['message']['content']
    player_id = interaction_response['p_id']
    player = Player.objects.get(id=player_id)

    response_message = "Thank you for confirming!"

    if is_elo_change:
        old_elo = player.rumble_elo
        player.rumble_elo = chosen_elo
        response_message = (
            f'Their elo has been changed from **{old_elo}** to '
            f'**{chosen_elo}**. Thank you!'
        )

    player.save()

    return JsonResponse({
        "type": InteractionCallbackTypes.UPDATE_MESSAGE,
        "data": {
            "content": f"{original_message}\n\n{response_message}",
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

    response = requests.post(
        'https://discord.com/api/oauth2/token',
        data=data,
        headers=headers
    )
    credentials = response.json()
    access_token = credentials['access_token']

    headers = {
        'Authorization': 'Bearer %s' % access_token
    }

    response = requests.get(
        'https://discord.com/api/v6/users/@me',
        headers=headers
    )

    return response.json()


def set_match_event(match, channel, time, event_id=None):
    end_time = time + timedelta(hours=match.match_format)
    data = {
        'entity_metadata': {
            'location': 'https://www.twitch.tv/forfunchampionshipseries'
        },
        'name': f'{match.teams.all()[0].name} vs {match.teams.all()[1].name}',
        'scheduled_start_time': time.isoformat(),
        'scheduled_end_time': end_time.isoformat(),
        'description': f'FFCS {match.season.name} match, week {match.week}',
        'entity_type': ScheduledEventEntityType.EXTERNAL,
        'privacy_level': 2
    }

    if event_id:
        res = discord_bot.modify_event(data, event_id).json()
    else:
        res = discord_bot.create_event(data).json()

    event_link = f'https://discord.com/events/{res["guild_id"]}/{res["id"]}'

    if not event_id:
        discord_bot.send_message(event_link, channel)

    match.event_id = res["id"]

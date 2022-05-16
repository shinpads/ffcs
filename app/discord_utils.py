import json
from app.models import Match, Player, Team, User
from django.utils import timezone
import pytz
from app.serializers.teamserializer import TeamSerializer
from .discord_bot import DiscordBot
from .discord_constants import ChannelTypes, permissions
from dotenv import load_dotenv
import os
import sys

load_dotenv()
discord_bot_token = os.getenv('DISCORD_BOT_TOKEN')
guild_id = os.getenv('DISCORD_GUILD_ID')
discord_bot = DiscordBot(discord_bot_token, guild_id)

def update_team_discord_info(team_id, players, updates):
    team = Team.objects.get(id=team_id)

    if team.discord_role_id == None:
        create_team_discord_role(team, players)

    if team.discord_channel_id == None:
        create_team_discord_channel(team)
    
    discord_bot.edit_role(team.discord_role_id, updates)
    team.color = updates['color']
    team.save()

    return

def update_user_info(user):
    now = timezone.now()
    last_updated_discord_info = user.last_updated_discord_info

    if (last_updated_discord_info != None and
        ((now - last_updated_discord_info).total_seconds() / 60) < 10):
        return
    
    res = discord_bot.get_user_info(user.discord_user_id).json()
    user.discord_username = res['username']
    if res['avatar'] != None:
        user.avatar = res['avatar']
    user.last_updated_discord_info = now
    user.save()

    return

def create_team_discord_role(team, players):
    data = {
        'color': team.color,
        'name': team.name,
        'hoist': True,
        'mentionable': True
    }

    res = discord_bot.create_role(data).json()
    role_id = res['id']
    team.discord_role_id = str(role_id)

    for player in players:
        player_obj = Player.objects.get(id=player['id'])
        discord_bot.assign_user_to_role(player_obj.user.discord_user_id, role_id)

    return

def create_team_discord_channel(team):
    everyone_permission_overwrite = {
        'id': discord_bot.guild_id,
        'type': 0,
        'allow': '0',
        'deny': str(permissions['CONNECT'])
    }

    team_permission_overwrite = {
        'id': team.discord_role_id,
        'type': 0,
        'allow': str(permissions['CONNECT']),
        'deny': '0'
    }

    data = {
        'name': team.name,
        'type': ChannelTypes.GUILD_VOICE,
        'permission_overwrites': [
            everyone_permission_overwrite,
            team_permission_overwrite
            ]
    }

    res = discord_bot.create_channel(data).json()
    team.discord_channel_id = res['id']

    return

def send_game_confirmation_dm(from_team_id, to_team_id, match_id):
    from_team = Team.objects.get(id=from_team_id)
    to_team = Team.objects.get(id=to_team_id)
    from_team_captain = from_team.captain.user
    to_team_captain = to_team.captain.user
    match = Match.objects.get(id=match_id)
    est = pytz.timezone('US/Eastern')
    proposed_time = match.proposed_for.astimezone(est)

    message = (
        "Your week {} match versus **{}** has been scheduled by their captain, "
        "**{}**, for **{}**. Please confirm or deny the requested date/time."
    ).format(
        match.week,
        from_team.name,
        from_team_captain.summoner_name,
        proposed_time.strftime('%a, %B %d, %Y, at %I:%M %p EST')
        )

    embeds = [
        create_team_embed(from_team)
    ]

    res = discord_bot.send_dm(
        to_team_captain.discord_user_id,
        message,
        create_message_confirmation_components(
            from_team_id,
            to_team_id,
            match_id
        ),
        embeds
    )

    return res.json()

def create_message_confirmation_components(
    from_team_id,
    to_team_id,
    match_id):
    components = [
        {
            "type": 1,
            "components": [
                {
                    "type": 2,
                    "label": "Confirm",
                    "style": 3,
                    "custom_id": json.dumps({
                        "i_type": "match_confirm",
                        "val": True,
                        "f_id": from_team_id,
                        "to_id": to_team_id,
                        "m_id": match_id,
                    })
                },
                {
                    "type": 2,
                    "label": "Deny",
                    "style": 4,
                    "custom_id": json.dumps({
                        "i_type": "match_confirm",
                        "val": False,
                        "f_id": from_team_id,
                        "to_id": to_team_id,
                        "m_id": match_id,
                    })
                }
            ]
        }
    ]

    return components

def create_team_embed(team):
    role_sorting = {
        "TOP": 0,
        "JG": 1,
        "MID": 2,
        "ADC": 3,
        "SUPP": 4
    }

    embed = {
        "type": "Rich",
        "title": team.name,
        "description": "",
        "color": team.color,
        "thumbnail": {
            "url": 'https://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/10.png',
            "height": 0,
            "width": 0
        },
        "author": {
            "name": team.season.name
        },
        "url": "https://ffcsleague.com/team/{}".format(team.id)
    }

    return embed
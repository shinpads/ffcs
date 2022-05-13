from app.models import Player, Team, User
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

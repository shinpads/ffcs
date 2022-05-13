from app.models import Player, Team
from .discord_bot import DiscordBot
from .discord_constants import ChannelTypes, permissions
from dotenv import load_dotenv
import os

load_dotenv()
discord_bot_token = os.getenv('DISCORD_BOT_TOKEN')
guild_id = os.getenv('DISCORD_GUILD_ID')
discord_bot = DiscordBot(discord_bot_token, guild_id)

def update_team_discord_info(team_id, players, updates):
    team = Team.objects.get(id=team_id)
    role_id = team.discord_role_id
    channel_id = team.discord_channel_id

    if role_id == None:
        role_id = create_team_discord_role(team_id, players)

    if channel_id == None:
        channel_id = create_team_discord_channel(team_id)
    
    discord_bot.edit_role(role_id, updates)

    return

def create_team_discord_role(team_id, players):
    team = Team.objects.get(id=team_id)

    data = {
        'color': team.color,
        'name': team.name,
        'hoist': True,
        'mentionable': True
    }

    res = discord_bot.create_role(data).json()
    role_id = res['id']
    team.discord_role_id = role_id
    team.save()

    for player in players:
        player_obj = Player.objects.get(id=player['id'])
        discord_bot.assign_user_to_role(player_obj.user.discord_user_id, role_id)

    return role_id

def create_team_discord_channel(team_id):
    team = Team.objects.get(id=team_id)

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
    team.save()

    return res['id']
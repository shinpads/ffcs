import os
import sys
from dotenv import load_dotenv

from app.discord_bot import DiscordBot

load_dotenv()
discord_bot_token = os.getenv('DISCORD_BOT_TOKEN')
guild_id = os.getenv('DISCORD_GUILD_ID')
discord_bot = DiscordBot(discord_bot_token, guild_id)

profile_command = {
    "name": "profile",
    "type": 1,
    "description": "See the profile of an FFCS player",
    "options": [
        {
            "name": "player",
            "description": "The summoner name of the player",
            "type": 3,
            "required": True
        }
    ]
}


def create_discord_slash_commands():
    print('Creating discord slash commands...')
    sys.stdout.flush()
    print(discord_bot.create_slash_command(profile_command).json())

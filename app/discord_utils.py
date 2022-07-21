import json
from app.models import Game, Match, Player, Rank, RegistrationForm, Team, User
from django.utils import timezone
import pytz
from app.serializers.teamserializer import TeamSerializer
from .discord_bot import DiscordBot
from .discord_constants import ChannelTypes, permissions
from dotenv import load_dotenv
from prettytable import PrettyTable
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

def give_user_rumble_role(user):
    rumble_role_id = os.getenv('RUMBLE_ROLE_ID')
    discord_bot.assign_user_to_role(user.discord_user_id, rumble_role_id)
    return

def send_rumble_match_announcement(matches):
    rumble_role_id = os.getenv('RUMBLE_ROLE_ID')
    channel = os.getenv('DISCORD_ANNOUNCEMENTS_CHANNEL')
    message = (
        f"<@&{rumble_role_id}> "
        "This week's rumble signups have closed, and teams have been created! "
        "\n**TEAMS:**"
    )

    for match in matches:
        table = PrettyTable()
        table.field_names = ["Blue Side", "Red Side"]
        for i in range(min(len(match['red']), len(match['blue']))):
            table.add_row([
                match['blue'][i].user.summoner_name,
                match['red'][i].user.summoner_name
            ])
        
        message += f'\n```\n{str(table)}\n```'
    
    discord_bot.send_message(message, channel)
    return

def send_rumble_promotion_announcement(player, rank):
    channel = os.getenv('DISCORD_ANNOUNCEMENTS_CHANNEL')
    message = (
        f"<@{player.user.discord_user_id}> "
        f"Has just promoted to {rank.name}! 🎉 🎉"
    )
    
    discord_bot.send_message(message, channel)
    return

def send_rumble_proposed_elo_message(player):
    channel = os.getenv('RUMBLE_ELO_CONFIRMATION_CHANNEL')
    registration_form = RegistrationForm.objects.get(
        is_rumble=True, user=player.user
    )
    rank_should_be = registration_form.rank_should_be
    message = (
        f"**{player.user.summoner_name}** just signed up! Their proposed ELO is "
        f"**{player.rumble_elo}**. They also mentioned their rank "
        f"should be **{rank_should_be}**. If the proposed ELO is accurate, "
        f"please press 'Confirm'. Otherwise, select a value from the dropdown."
    )
    print('reached')
    components = create_rumble_proposed_elo_components(player)
    print(discord_bot.send_message(message, channel, components).json())

def send_mvp_vote_dm(game, players):
    message = (
        "Congrats on the win! Please vote for the game MVP "
        "(you cannot vote yourself)."
    )

    for player in players:
        player_choices = [p for p in players if p != player]
        if len(player_choices) == 0:
            continue
        components = create_mvp_vote_components(len(players), player_choices, game)
        discord_bot.send_dm(player.user.discord_user_id, message, components)

def change_user_rank_role(user, rank):
    user_discord_data = discord_bot.get_user_guild_info(
        user.discord_user_id
    ).json()

    rank_discord_role_ids = []
    
    for rank in Rank.objects.all():
        if rank.discord_role_id:
            rank_discord_role_ids.append(rank.discord_role_id)

    for rank_discord_role_id in rank_discord_role_ids:
        if rank_discord_role_id in user_discord_data['roles']:
            discord_bot.remove_role_from_user(
                user.discord_user_id,
                rank_discord_role_id
            )
    
    discord_bot.assign_user_to_role(user.discord_user_id, rank.discord_role_id)

def create_rumble_proposed_elo_components(player):
    elo_choice_increment = 25
    components = [
        {
            "type": 1,
            "components": [
                {
                    "type": 2,
                    "label": "Confirm",
                    "style": 3,
                    "custom_id": json.dumps({
                        "i_type": "proposed_elo_confirm",
                        "val": True,
                        "p_id": player.id
                    })
                },
            ]
        },
        {
            "type": 1,
            "components": [
                {
                    "type": 3,
                    "custom_id": json.dumps({
                        "i_type": "proposed_elo_change",
                        "p_id": player.id,
                    }),
                    "options": [
                        {
                            "label": elo,
                            "value": elo
                        } for elo in range(
                            max(player.rumble_elo - 300, 0),
                            player.rumble_elo + 300,
                            elo_choice_increment
                        )
                    ],
                    "placeholder": "Select new ELO"
                }
            ]
        }
    ]

    return components

def create_mvp_vote_components(num_of_voters, players, game):
    components = [
        {
            "type": 1,
            "components": [
                {
                    "type": 3,
                    "custom_id": json.dumps({
                        "i_type": "mvp_vote",
                        "g_id": game.id,
                        "voters": num_of_voters
                    }),
                    "options": [
                        {
                            "label": player.user.summoner_name,
                            "value": player.id
                        } for player in players
                    ],
                    "placeholder": "Vote for game MVP"
                }
            ]
        }
    ]

    return components

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
            "url": team.logo_url if team.logo_url else 'https://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/2.png',
            "height": 0,
            "width": 0
        },
        "author": {
            "name": team.season.name
        },
        "url": "https://ffcsleague.com/team/{}".format(team.id)
    }

    return embed

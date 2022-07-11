from dotenv import load_dotenv
from datetime import datetime

from app.elo_utils import create_teams
from .models import Player, RumbleWeek
from .utils import get_info_by_account_id
from apscheduler.schedulers.background import BackgroundScheduler
import sys
import os

load_dotenv()

def start():
    scheduler = BackgroundScheduler()
    # scheduler.add_job(
    #     calculate_teams,
    #     'cron',
    #     day_of_week='wed',
    #     hour='17',
    #     minute='30',
    #     timezone='est'
    # )
    scheduler.add_job(calculate_teams, 'interval', seconds=5, max_instances=1)
    scheduler.add_job(update_summoner_info, 'interval', minutes=20, max_instances=1)
    scheduler.start()

def calculate_teams():
    print('calculating teams...')
    sys.stdout.flush()
    try:
        current_rumble_week = RumbleWeek.objects.latest('created_at')
    except:
        return
    current_rumble_week.signups_open = False

    signups = list(current_rumble_week.signups.all())
    if len(signups) < 10:
        return
    
    signups.sort(
        key=lambda signup: signup.created_at
    )

    players = list(map(
        lambda signup: signup.player,
        signups
    ))
    players = players[:int(len(players) / 10) * 10]

    create_teams(players)

def update_summoner_info():
    debug = os.getenv('DEBUG')
    if debug:
        return
    all_players = Player.objects.all()
    print('updating summoners...')
    sys.stdout.flush()

    for player in all_players:
        if not player.account_id:
            continue

        player_info = get_info_by_account_id(player.account_id)

        if player_info == None:
            continue
        user = player.user

        player.profile_icon_id = player_info['profileIconId']
        user.summoner_name = player_info['name']
        user.summoner_level = player_info['summonerLevel']
        user.summoner_id = player_info['id']

        user.save()
        player.save()

    return
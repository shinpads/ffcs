from itertools import chain
from dotenv import load_dotenv
import datetime

import pytz
from app.discord_utils import send_rumble_match_announcement

from app.elo_utils import create_teams
from .models import Match, Player, RumbleWeek, ScheduleTest, Season, Team
from .utils import generate_tournament_code, get_info_by_account_id
from apscheduler.schedulers.background import BackgroundScheduler
import sys
import os
from .scripts.rumble_matches import create_rumble_matches

load_dotenv()

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        calculate_teams,
        'cron',
        day_of_week='wed',
        hour='17',
        minute='30',
        timezone='est'
    )
    scheduler.add_job(
        test_scheduler,
        'cron',
        day_of_week='tue',
        hour='16',
        minute='00',
        timezone='est'
    )
    # scheduler.add_job(
    #     create_new_rumble_week,
    #     'cron',
    #     day_of_week='sat',
    #     hour='0',
    #     minute='0',
    #     timezone='est'
    # )
    scheduler.add_job(update_summoner_info, 'interval', minutes=20, max_instances=1)
    scheduler.start()

def test_scheduler():
    sched_test = ScheduleTest()
    sched_test.reached = True
    print('Creating new Rumble week...')
    sys.stdout.flush()
    sched_test.save()

def create_new_rumble_week():
    print('Creating new Rumble week...')
    sys.stdout.flush()

    rumble_season = Season.objects.get(is_rumble=True)

    rumble_week = RumbleWeek()
    rumble_week.season = rumble_season
    rumble_week.save()

def calculate_teams():
    create_rumble_matches()

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
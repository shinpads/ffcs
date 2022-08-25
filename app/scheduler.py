from dotenv import load_dotenv
from app.discord_utils import send_rumble_game_reminder, send_rumble_registration_reminder

from app.scripts.new_rumble_week import create_rumble_week

from .models import Player, RumbleWeek, ScheduleTest, Season, Team
from .utils import get_info_by_account_id
from apscheduler.schedulers.background import BackgroundScheduler
import sys
import os
from .scripts.rumble_matches import create_rumble_matches

load_dotenv()

DAYS_OF_WEEK = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']
TIMEZONE = 'utc'
RUMBLE_GAME_TIME = {
    'day': 'sat',
    'hour': '2',
    'minute': '00'
}
RUMBLE_GAME_REMINDER_TIME = {
    'day': 'sat',
    'hour': '00',
    'minute': '00'
}
RUMBLE_SIGNUP_CLOSE_TIME = {
    'day': 'sat',
    'hour': '1',
    'minute': '00'
}
RUMBLE_SIGNUP_OPEN_TIME = {
    'day': 'sat',
    'hour': '4',
    'minute': '0'
}

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        calculate_teams,
        'cron',
        day_of_week=RUMBLE_SIGNUP_CLOSE_TIME['day'],
        hour=RUMBLE_SIGNUP_CLOSE_TIME['hour'],
        minute=RUMBLE_SIGNUP_CLOSE_TIME['minute'],
        timezone=TIMEZONE,
        max_instances=1
    )
    scheduler.add_job(
        create_new_rumble_week,
        'cron',
        day_of_week=RUMBLE_SIGNUP_OPEN_TIME['day'],
        hour=RUMBLE_SIGNUP_OPEN_TIME['hour'],
        minute=RUMBLE_SIGNUP_OPEN_TIME['minute'],
        timezone=TIMEZONE,
        max_instances=1
    )
    scheduler.add_job(
        rumble_registration_reminder,
        'cron',
        day_of_week=DAYS_OF_WEEK[DAYS_OF_WEEK.index(RUMBLE_SIGNUP_CLOSE_TIME['day'])-1],
        hour=RUMBLE_SIGNUP_CLOSE_TIME['hour'],
        minute=RUMBLE_SIGNUP_CLOSE_TIME['minute'],
        timezone=TIMEZONE,
        max_instances=1
    )
    scheduler.add_job(
        rumble_game_reminder,
        'cron',
        day_of_week=RUMBLE_GAME_REMINDER_TIME['day'],
        hour=RUMBLE_GAME_REMINDER_TIME['hour'],
        minute=RUMBLE_GAME_REMINDER_TIME['minute'],
        timezone=TIMEZONE,
        max_instances=1
    )
    scheduler.add_job(update_summoner_info, 'interval', minutes=20, max_instances=1)
    scheduler.start()

def rumble_registration_reminder():
    print('Reminding about registration...')
    sys.stdout.flush()

    send_rumble_registration_reminder()

def rumble_game_reminder():
    print('Reminding about game...')
    sys.stdout.flush()

    send_rumble_game_reminder()

def create_new_rumble_week():
    print('Creating new Rumble week...')
    sys.stdout.flush()

    create_rumble_week()

def calculate_teams():
    print('Calculating teams...')
    sys.stdout.flush()

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
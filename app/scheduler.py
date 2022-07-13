from dotenv import load_dotenv
import datetime

import pytz

from app.elo_utils import create_teams
from .models import Match, Player, RumbleWeek, Season, Team
from .utils import generate_tournament_code, get_info_by_account_id
from apscheduler.schedulers.background import BackgroundScheduler
import sys
import os

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

def create_new_rumble_week():
    print('Creating new Rumble week...')
    sys.stdout.flush()

    rumble_season = Season.objects.get(is_rumble=True)

    rumble_week = RumbleWeek()
    rumble_week.season = rumble_season
    rumble_week.save()

def calculate_teams():
    debug = os.getenv('DEBUG')
    if not debug:
        print('Calculating teams...')
        sys.stdout.flush()
        return

    print('Calculating teams...')
    sys.stdout.flush()

    try:
        current_rumble_week = RumbleWeek.objects.latest('created_at')
    except:
        return
    if not current_rumble_week:
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

    matches = create_teams(players)
    
    for i, match in enumerate(matches):
        print(match)
        blue_team = Team()
        blue_team.name = (
            f'week {current_rumble_week.id}, match {i+1}, blue team'
        )
        blue_team.season = current_rumble_week.season
        blue_team.is_rumble = True
        blue_team.rumble_week = current_rumble_week
        blue_team.rumble_top = match['blue'][0]
        blue_team.rumble_jg = match['blue'][1]
        blue_team.rumble_mid = match['blue'][2]
        blue_team.rumble_adc = match['blue'][3]
        blue_team.rumble_supp = match['blue'][4]
        blue_team.save()

        red_team = Team()
        red_team.name = (
            f'week {current_rumble_week.id}, match {i+1}, red team'
        )
        red_team.season = current_rumble_week.season
        red_team.is_rumble = True
        red_team.rumble_week = current_rumble_week
        red_team.rumble_top = match['red'][0]
        red_team.rumble_jg = match['red'][1]
        red_team.rumble_mid = match['red'][2]
        red_team.rumble_adc = match['red'][3]
        red_team.rumble_supp = match['red'][4]
        red_team.save()

        new_match = Match()
        new_match.match_format = 1
        new_match.season = current_rumble_week.season
        new_match.is_rumble = True
        new_match.elo_difference = match['elo_difference']
        new_match.role_pref_coefficient = match['role_pref_coefficient']
        new_match.blue_side = blue_team
        new_match.save()
        new_match.teams.add(blue_team)
        new_match.teams.add(red_team)

        est = pytz.timezone('US/Eastern')
        today = datetime.datetime.now(est)
        friday = today + datetime.timedelta((4 - today.weekday()) % 7)
        match_time = friday.replace(hour=20, minute=30, second=0)
        new_match.scheduled_for = match_time

        new_match.save()

        game = new_match.games.all()[0]
        if not game.tournament_code:
            tournament_code = generate_tournament_code(game, Player)
            if tournament_code:
                game.tournament_code = tournament_code
                game.save()

    print('Finished calculating teams.')
    sys.stdout.flush()

    return

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
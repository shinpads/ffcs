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
        day_of_week='mon',
        hour='11',
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
    sched_test.save()

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
    current_rumble_week.save()

    signups = list(current_rumble_week.signups.all())
    if len(signups) < 10:
        return
    
    signups.sort(
        key=lambda signup: signup.created_at
    )

    priority_signups = []

    for signup in signups:
        if signup.player.has_rumble_priority:
            priority_signups.append(signup)
            player = signup.player
            player.has_rumble_priority = False
            player.save()
    
    for signup in priority_signups:
        signups.remove(signup)

    
    sorted_signups = list(chain(*[priority_signups, signups]))

    players = list(map(
        lambda signup: signup.player,
        sorted_signups
    ))
    num_of_remaining_players = len(players) % 10
    if num_of_remaining_players > 0:
        not_added_players = players[-num_of_remaining_players:]
    players = players[:int(len(players) / 10) * 10]
    
    for player in not_added_players:
        player.has_rumble_priority = True
        player.save()

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
        new_match.rumble_week = current_rumble_week
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
        
    send_rumble_match_announcement(matches)

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
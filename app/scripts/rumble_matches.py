from itertools import chain
from dotenv import load_dotenv
import datetime

import pytz
from app.discord_utils import send_rumble_match_announcement

from app.elo_utils import create_teams
from ..models import Match, Player, RumbleWeek, Team
from ..utils import generate_tournament_code
import sys
import os

def create_rumble_matches():
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
    
    current_matches = Match.objects.filter(rumble_week=current_rumble_week)
    if len(current_matches) > 0:
        for current_match in current_matches.all():
            try:
                for game in current_match.games.all():
                    game.delete()
                for team in current_match.teams.all():
                    team.delete()
                current_match.delete()
            except:
                continue
    
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
    not_added_players = []
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
        blue_team.avg_rumble_elo = match['blue_avg_elo']
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
        red_team.avg_rumble_elo = match['red_avg_elo']
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
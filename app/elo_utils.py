from random import shuffle
from itertools import permutations
from app.rank_utils import get_win_or_loss_streak

from app.utils import get_rumble_player_games

RANK_VALUES = {
    "Unranked": 1100,
    "Iron 4": 600,
    "Iron 3": 650,
    "Iron 2": 700,
    "Iron 1": 750,
    "Bronze 4": 800,
    "Bronze 3": 850,
    "Bronze 2": 900,
    "Bronze 1": 1000,
    "Silver 4": 1100,
    "Silver 3": 1200,
    "Silver 2": 1300,
    "Silver 1": 1400,
    "Gold 4": 1500,
    "Gold 3": 1600,
    "Gold 2": 1700,
    "Gold 1": 1800,
    "Platinum 4": 1900,
    "Platinum 3": 2000,
    "Platinum 2": 2100,
    "Platinum 1": 2200,
    "Diamond 4": 2300,
    "Diamond 3": 2400,
    "Diamond 2": 2500,
    "Diamond 1": 2600,
    "Master": 2700,
    "Grandmaster": 2800,
    "Challenger": 2900,
}
ROLES = ['top', 'jungle', 'mid', 'bot', 'support']
PREFERRED_ROLE_COEFFICIENTS = [1, 0.5, 0.25, 0.1, 0]
MIN_ROLE_PREF_COEFFICIENT = 6.5

BASE_ELO_COEFFICIENT = 20

def calculate_initial_elo(current_rank, highest_rank):
    current_rank_weighting = 0.75
    highest_rank_weighting = 0.25

    current_rank_weighted = current_rank_weighting * RANK_VALUES[current_rank]
    highest_rank_weighted = highest_rank_weighting * RANK_VALUES[highest_rank]

    return int(current_rank_weighted + highest_rank_weighted)

def adjust_player_elo(player, game, player_team, player_win):
    if not player_team:
        return
    enemy_team = [team for team in game.match.teams.all() if team != player_team][0]
    player_num_games = player.rumble_wins + player.rumble_losses
    player_games = get_rumble_player_games(player)
    win_loss_streak = get_win_or_loss_streak(player_games, player_win)

    E = 1/(1 + (10**((enemy_team.avg_rumble_elo - player_team.avg_rumble_elo)/400)))

    S = 1 if player_win else 0

    placement_coefficient = 1
    if player_num_games < 5:
        placement_coefficient += (5 - player_num_games)*0.2
    
    streak_coefficient = 1
    if win_loss_streak > 0:
        streak_coefficient = 1 + ((win_loss_streak - 1) * 0.1)
    
    K = BASE_ELO_COEFFICIENT * placement_coefficient * streak_coefficient
    
    elo_adjustment = round(float(K) * (float(S) - float(E)))
    player.rumble_elo += elo_adjustment
    player.save()
    return player
    

def create_teams(players):
    shuffle(players)
    all_match_permutations = []
    chosen_matches = []

    for i in range(int(len(players) / 10)):
        all_match_permutations.append(
            create_match_permutations(players[i*10:(i+1)*10])
        )


    for match_permutations in all_match_permutations:
        match_permutations.sort(
            key=lambda team: team['role_pref_coefficient']
        )
        
        match_permutations.sort(
            key=lambda team: team['elo_difference']
        )
        match_permutations = match_permutations[:5]

        match_permutations.sort(
            key=lambda team: team['role_pref_coefficient']
        )

        chosen_match = ensure_best_role_assignment(match_permutations[-1])

        chosen_matches.append(chosen_match)
    
    return chosen_matches

def ensure_best_role_assignment(teams):
    blue_team = list(teams['blue'])
    red_team = list(teams['red'])

    blue_coefficients = {}
    red_coefficients = {}

    for permutation in permutations(blue_team):
        coefficient = calculate_team_role_pref_coefficient(list(permutation))
        blue_coefficients[coefficient] = permutation
    
    for permutation in permutations(red_team):
        coefficient = calculate_team_role_pref_coefficient(list(permutation))
        red_coefficients[coefficient] = permutation
    
    best_blue_coefficient = max(blue_coefficients.keys())
    best_red_coefficient = max(red_coefficients.keys())

    role_pref_coefficient = best_blue_coefficient + best_red_coefficient

    teams['blue'] = list(blue_coefficients[best_blue_coefficient])
    teams['red'] = list(red_coefficients[best_red_coefficient])
    teams['role_pref_coefficient'] = role_pref_coefficient

    return teams

def calculate_elo_difference(teams):
    return abs(
        team_elo_average(teams['blue']) - team_elo_average(teams['red'])
    )

def team_elo_average(players):
    return sum(list(map(
        lambda player: player.rumble_elo, players
    ))) / len(players);

def create_match_permutations(players):
    match_permutations = []

    for permutation in permutations(players):
        teams = {
            'blue': list(permutation)[0:5],
            'red': list(permutation)[5:10]
        }
        teams['blue_avg_elo'] = team_elo_average(teams['blue'])
        teams['red_avg_elo'] = team_elo_average(teams['red'])
        teams['role_pref_coefficient'] = calculate_role_pref_coefficient(teams)
        teams['elo_difference'] = calculate_elo_difference(teams)
        no_banned_players = True

        for i, player in enumerate(list(permutation)):
            role = ROLES[i % 5]
            if role == player.banned_role:
                no_banned_players = False
                break

        if teams['role_pref_coefficient'] >= MIN_ROLE_PREF_COEFFICIENT and \
           no_banned_players:
            match_permutations.append(teams)
    
    return match_permutations

def calculate_role_pref_coefficient(teams):
    roles_coefficient = 0

    for side in ['blue', 'red']:
        roles_coefficient += calculate_team_role_pref_coefficient(teams[side])

    return roles_coefficient

def calculate_team_role_pref_coefficient(team):
    roles_coefficient = 0
    for i, player in enumerate(team):
        role = ROLES[i]
        roles_coefficient += player.role_preferences[role]
    
    return roles_coefficient
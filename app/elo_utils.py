from random import shuffle

from app.utils import create_all_team_combinations

RANK_VALUES = {
    "Iron 4": 600,
    "Iron 3": 650,
    "Iron 2": 700,
    "Iron 1": 750,
    "Bronze 4": 800,
    "Bronze 3": 850,
    "Bronze 2": 900,
    "Bronze 1": 100,
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

def calculate_initial_elo(current_rank, highest_rank):
    current_rank_weighting = 0.75
    highest_rank_weighting = 0.25

    current_rank_weighted = current_rank_weighting * RANK_VALUES[current_rank]
    highest_rank_weighted = highest_rank_weighting * RANK_VALUES[highest_rank]

    return int(current_rank_weighted + highest_rank_weighted)

def create_teams(players):
    shuffle(players)
    all_match_combinations = []

    for i in range(int(len(players) / 10)):
        all_match_combinations.append(
            create_all_team_combinations(players[i*10:(i+1)*10])
        )

    for match_combinations in all_match_combinations:
        match_combinations.sort(key=elo_difference)
    
    return

def elo_difference(combination):
    return abs(
        team_elo_average(combination[0]) - team_elo_average(combination[1])
    )

def team_elo_average(players):
    return sum(list(map(
        lambda player: player.rumble_elo, players
    ))) / len(players);
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
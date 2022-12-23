from app.discord_utils import change_user_rank_role, send_rumble_rank_updates
from app.models import Player, Rank
from app.utils import get_rumble_player_games


DEFAULT_LP_LOSS = 25
LP_LOSS_STREAK_MULTIPLIER = 10

DEFAULT_LP_GAIN = 25
LP_WIN_STREAK_MULTIPLIER = 15

STREAK_GAMES = 3

MIN_NUM_OF_GAMES_BEFORE_RANK = 3


def get_win_or_loss_streak(player_games, game_is_win):
    player_games = player_games[1:]
    past_result = game_is_win
    win_loss_streak = 1

    for i, game in enumerate(player_games):
        result = game['game'].winner == game['team']

        if past_result != result:
            break

        past_result = bool(result)
        win_loss_streak += 1

    return win_loss_streak


def calculate_lp_loss():
    return DEFAULT_LP_LOSS


def calculate_lp_gain():
    return DEFAULT_LP_GAIN


def adjust_player_lp_on_loss(player):
    lp_loss = calculate_lp_loss()

    if player.rumble_lp - lp_loss >= -100:
        player.rumble_lp -= lp_loss
    else:
        player.rumble_lp = -100

    player.rumble_losses += 1
    player.save()
    return player


def adjust_player_lp_on_win(player):
    lp_gain = calculate_lp_gain()

    player.rumble_lp += lp_gain
    player.rumble_wins += 1
    player.save()
    return player


def update_all_rumble_ranks():
    updated_player_ranks = []

    rumble_players = list(Player.objects.filter(is_rumble=True).all())
    rumble_players.sort(
        key=lambda player: player.rumble_lp
    )
    rumble_players = list(filter(
        lambda player: player.rumble_wins +
        player.rumble_losses >= MIN_NUM_OF_GAMES_BEFORE_RANK,
        rumble_players
    ))

    ranks = list(Rank.objects.all())
    ranks.sort(key=lambda rank: rank.threshold_percentile)
    ranks.reverse()

    for i, player in enumerate(rumble_players):
        if player.rumble_wins + player.rumble_losses < MIN_NUM_OF_GAMES_BEFORE_RANK:
            continue

        player_percentile = (i / len(rumble_players)) * 100
        player_rank_id = int(player.rumble_rank.id)

        if (i+1) == len(rumble_players):
            if player.rumble_lp != rumble_players[i-1].rumble_lp:
                if not player.rumble_rank.is_top_rank:
                    top_rank = Rank.objects.get(is_top_rank=True)
                    updated_player_ranks.append({
                        'player': player,
                        'old_rank_id': player_rank_id,
                        'new_rank_id': int(top_rank.id)
                    })
                    player.rumble_rank = top_rank
                    player.save()
                    change_user_rank_role(player.user, top_rank)
                continue

        for rank in ranks:
            if rank.is_default or rank.is_top_rank:
                continue

            if player_percentile >= rank.threshold_percentile:
                print(player_percentile, rank.name)
                if rank.id != player_rank_id:
                    updated_player_ranks.append({
                        'player': player,
                        'old_rank_id': player_rank_id,
                        'new_rank_id': int(rank.id)
                    })
                    player.rumble_rank = rank
                    player.save()
                    change_user_rank_role(player.user, rank)
                break

    send_rumble_rank_updates(updated_player_ranks)

    return

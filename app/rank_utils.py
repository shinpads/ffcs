from app.discord_utils import send_rumble_promotion_announcement
from app.models import Rank
from app.utils import get_rumble_player_games


DEFAULT_LP_LOSS = 25
LP_LOSS_STREAK_MULTIPLIER = 10

DEFAULT_LP_GAIN = 25
LP_WIN_STREAK_MULTIPLIER = 15

STREAK_GAMES = 3

RANK_MAX = 6

def get_win_or_loss_streak(player_games):
    past_result = 'blank'
    win_loss_streak = 0

    for i, game in enumerate(player_games):
        result = game['game'].winner == game['team']
        
        if past_result != 'blank' and past_result != result:
            return
        
        past_result = int(result)
        win_loss_streak = int(i + 1)

    return win_loss_streak

def calculate_lp_loss(win_loss_streak):
    lp_loss = DEFAULT_LP_LOSS

    if win_loss_streak >= STREAK_GAMES:
        lp_loss += (win_loss_streak - 2) * LP_LOSS_STREAK_MULTIPLIER
    
    return lp_loss

def calculate_lp_gain(win_loss_streak):
    lp_gain = DEFAULT_LP_GAIN
    
    if win_loss_streak >= 3:
        lp_gain += (win_loss_streak - 2) * LP_WIN_STREAK_MULTIPLIER

def adjust_player_lp_and_rank_on_loss(player):
    player_games = get_rumble_player_games(player)
    win_loss_streak = get_win_or_loss_streak(player_games)
    lp_loss = calculate_lp_loss(win_loss_streak)

    if player.rumble_lp - lp_loss < 0:
        if player.rumble_rank.value > 1:
            player.rumble_lp += 100
            lower_rumble_rank = Rank.objects.get(
                value=player.rumble_rank.value-1
            )
            player.rumble_rank = lower_rumble_rank
        else:
            player.rumble_lp = lp_loss
    
    player.rumble_lp -= lp_loss
    player.save()

def adjust_player_lp_and_rank_on_win(player):
    player_games = get_rumble_player_games(player)
    win_loss_streak = get_win_or_loss_streak(player_games)
    lp_gain = calculate_lp_gain(win_loss_streak)

    if player.rumble_lp + lp_gain > 100:
        if player.rumble_rank.value < RANK_MAX:
            player.rumble_lp -= 100
            next_rumble_rank = Rank.objects.get(
                value=player.rumble_rank.value+1
            )
            player.rumble_rank = next_rumble_rank
            send_rumble_promotion_announcement(player, next_rumble_rank)
            
    
    player.rumble_lp += lp_gain
    player.save()

from django.core.management.base import BaseCommand, CommandError
from app.discord_utils import change_user_rank_role

from app.models import Player, Rank
from app.rank_utils import adjust_player_lp_and_rank_on_loss, adjust_player_lp_and_rank_on_win
from ...utils import get_rumble_player_games

class Command(BaseCommand):
    help="Test to get player games"

    def handle(self, *args, **options):
        rank = Rank.objects.get(value=1)
        adjust_player_lp_and_rank_on_win(Player.objects.get(id=99))

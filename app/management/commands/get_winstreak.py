from django.core.management.base import BaseCommand, CommandError
from app.discord_utils import change_user_rank_role, create_match_image
from app.elo_utils import adjust_player_elo

from app.models import Game, Player, Rank, Team
from app.rank_utils import update_all_rumble_ranks
from ...utils import get_rumble_player_games

class Command(BaseCommand):
    help="Test to get player games"

    def handle(self, *args, **options):
        create_match_image()

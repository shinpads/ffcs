from django.core.management.base import BaseCommand, CommandError
from app.discord_utils import change_user_rank_role

from app.models import Player, Rank
from app.rank_utils import update_all_rumble_ranks
from ...utils import get_rumble_player_games

class Command(BaseCommand):
    help="Test to get player games"

    def handle(self, *args, **options):
        update_all_rumble_ranks()

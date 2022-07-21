from django.core.management.base import BaseCommand, CommandError
from app.discord_utils import change_user_rank_role

from app.models import Player, Rank
from ...utils import get_rumble_player_games

class Command(BaseCommand):
    help="Test to get player games"

    def handle(self, *args, **options):
        rank = Rank.objects.get(value=1)
        change_user_rank_role(Player.objects.get(id=99).user, rank)

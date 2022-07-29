from django.core.management.base import BaseCommand, CommandError
from app.discord_utils import change_user_rank_role
from app.elo_utils import adjust_player_elo

from app.models import Game, Player, Rank, Team
from app.rank_utils import update_all_rumble_ranks
from ...utils import get_rumble_player_games

class Command(BaseCommand):
    help="Test to get player games"

    def handle(self, *args, **options):
        player = Player.objects.get(id=99)
        game = Game.objects.get(id=109)
        player_team = Team.objects.get(id=53)
        player_win = True
        adjust_player_elo(player, game, player_team, player_win)

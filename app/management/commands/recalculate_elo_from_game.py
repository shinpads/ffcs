from django.core.management.base import BaseCommand, CommandError

from app.elo_utils import adjust_player_elo
from ...scripts.new_rumble_week import create_rumble_week
from app.models import Game

class Command(BaseCommand):
    help="Does elo from game (does not revert current values)"

    def add_arguments(self, parser):
        parser.add_argument('game_id')

    def handle(self, *args, **options):
        game = Game.objects.get(id=options['game_id'])
        teams = game.match.teams.all()
        for team in teams:
            is_win = game.winner == team
            for player in [
                team.rumble_top,
                team.rumble_jg,
                team.rumble_mid,
                team.rumble_adc,
                team.rumble_supp
            ]:
                adjust_player_elo(player, game, team, is_win)

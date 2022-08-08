from django.core.management.base import BaseCommand, CommandError

from app.discord_utils import send_rumble_game_finish_message
from app.models import Game
from ...scripts.rumble_matches import create_rumble_matches

class Command(BaseCommand):
    help="Creates teams for most recent week"

    def handle(self, *args, **options):
        game = Game.objects.get(id=99)
        players = [
            game.winner.rumble_top,
            game.winner.rumble_jg,
            game.winner.rumble_mid,
            game.winner.rumble_adc,
            game.winner.rumble_supp
        ]
        send_rumble_game_finish_message(game, players)

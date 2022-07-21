from django.core.management.base import BaseCommand, CommandError

from app.models import Player
from ...utils import get_rumble_player_games

class Command(BaseCommand):
    help="Test to get player games"

    def handle(self, *args, **options):
        get_rumble_player_games(Player.objects.get(id=99))

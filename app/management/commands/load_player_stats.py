from django.core.management.base import BaseCommand, CommandError
from ...scripts import player_stats

class Command(BaseCommand):
    help="Loads player stats"

    def handle(self, *args, **options):
        player_stats.calculate_player_stats()

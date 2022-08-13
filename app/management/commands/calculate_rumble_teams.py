from django.core.management.base import BaseCommand, CommandError
from ...scheduler import calculate_teams

class Command(BaseCommand):
    help="Creates teams for most recent week"

    def handle(self, *args, **options):
        calculate_teams()

from django.core.management.base import BaseCommand, CommandError
from ...scripts.rumble_matches import create_rumble_matches

class Command(BaseCommand):
    help="Creates teams for most recent week"

    def handle(self, *args, **options):
        create_rumble_matches()

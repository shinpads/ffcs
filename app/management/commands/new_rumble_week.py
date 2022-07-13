from django.core.management.base import BaseCommand, CommandError
from ...scheduler import create_new_rumble_week

class Command(BaseCommand):
    help="Creates new rumble week"

    def handle(self, *args, **options):
        create_new_rumble_week()

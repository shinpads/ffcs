from django.core.management.base import BaseCommand, CommandError
from ...scripts.new_rumble_week import create_rumble_week

class Command(BaseCommand):
    help="Creates new rumble week"

    def handle(self, *args, **options):
        create_rumble_week()

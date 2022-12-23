from app.rank_utils import update_all_rumble_ranks

from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Updates all ranks"

    def handle(self, *args, **options):
        update_all_rumble_ranks()

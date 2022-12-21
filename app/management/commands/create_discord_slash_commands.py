from django.core.management.base import BaseCommand
from ...scripts.create_discord_slash_commands import create_discord_slash_commands


class Command(BaseCommand):
    help = "Create discord slash commands"

    def handle(self, *args, **options):
        create_discord_slash_commands()

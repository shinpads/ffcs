import sys
from app.discord_utils import send_new_rumble_week_announcement

from app.models import RumbleWeek, Season


def create_rumble_week():
    print('Creating new Rumble week...')
    sys.stdout.flush()

    rumble_season = Season.objects.get(is_rumble=True)

    rumble_week = RumbleWeek()
    rumble_week.season = rumble_season
    rumble_week.save()

    send_new_rumble_week_announcement()

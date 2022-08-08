import sys
from app.discord_utils import delete_team_channel, delete_team_role, send_new_rumble_week_announcement

from app.models import RumbleWeek, Season


def create_rumble_week():
    print('Creating new Rumble week...')
    sys.stdout.flush()

    rumble_season = Season.objects.get(is_rumble=True)

    try:
        current_rumble_week = RumbleWeek.objects.latest('created_at')
        for match in current_rumble_week.matches.all():
            for team in match.teams.all():
                delete_team_channel(team)
                delete_team_role(team)
    except:
        pass

    rumble_week = RumbleWeek()
    rumble_week.season = rumble_season
    rumble_week.save()

    send_new_rumble_week_announcement()

from django.http import HttpResponse
from ..models import Team, Season
import json


def get_team(request, data):
    data = json.loads(data)
    team = Team.objects.get(name=data['team_name'], season=data['season'])
    return HttpResponse('found team called ' + team.name)


def post_team(request, data):
    data = json.loads(data)

    t = Team()
    t.name = data['team_name']
    t.season = Season.objects.get(number=data['season'])
    t.save()

    return HttpResponse('successfully added team.')

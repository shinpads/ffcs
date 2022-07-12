from rest_framework import serializers
from django.core.serializers import serialize

from app.serializers.rumbleweekserializer import RumbleWeekSerializer
from .teamserializer import TeamSerializer
from ..models import Season

class SeasonSerializer(serializers.ModelSerializer):
    teams = serializers.SerializerMethodField('all_teams')
    rumble_weeks = RumbleWeekSerializer(many=True)

    class Meta:
        model = Season
        fields = '__all__'

    def all_teams(self, obj):
        teams_list = []
        for x in obj.team_set.all():
            teams_list.append(TeamSerializer(x).data)
        return teams_list
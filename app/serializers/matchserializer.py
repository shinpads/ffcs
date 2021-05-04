from rest_framework import serializers
from django.core.serializers import serialize
from .teamserializer import TeamSerializer
from ..models import Match

class MatchSerializer(serializers.ModelSerializer):
    teams = serializers.SerializerMethodField('get_teams')
    winner = TeamSerializer()

    class Meta:
        model = Match
        fields = '__all__'


    def get_teams(self, obj):
        return [TeamSerializer(team).data for team in obj.teams.all()]

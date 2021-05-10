from rest_framework import serializers
from django.core.serializers import serialize
from .playerserializer import PlayerSerializer
from ..models import Team

class TeamSerializer(serializers.ModelSerializer):
    players = serializers.SerializerMethodField('all_players')

    class Meta:
        model = Team
        fields = '__all__'

    def all_players(self, obj):
        players_list = []
        for x in obj.player_set.all().select_related('user'):
            players_list.append(PlayerSerializer(x).data)
        return players_list

from rest_framework import serializers
from django.core.serializers import serialize
from .playerserializer import PlayerSerializer
from ..models import Team

class TeamSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True)
    rumble_players = PlayerSerializer(many=True)
    captain = PlayerSerializer()

    class Meta:
        model = Team
        fields = '__all__'

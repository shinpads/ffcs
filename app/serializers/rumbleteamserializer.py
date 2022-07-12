from rest_framework import serializers

from .playerserializer import PlayerSerializer
from app.models import RumbleTeam

class RumbleTeamSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True)
    
    class Meta:
        model = RumbleTeam
        fields = '__all__'

from rest_framework import serializers

from app.models import RumbleWeek
from app.serializers.rumblesignupserializer import RumbleSignupSerializer
from app.serializers.rumbleteamserializer import RumbleTeamSerializer

class RumbleWeekSerializer(serializers.ModelSerializer):
    teams = RumbleTeamSerializer(many=True)
    signups = RumbleSignupSerializer(many=True)

    class Meta:
        model = RumbleWeek
        fields = '__all__'

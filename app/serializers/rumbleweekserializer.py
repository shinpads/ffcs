from rest_framework import serializers

from app.models import RumbleWeek
from app.serializers.rumblesignupserializer import RumbleSignupSerializer
from app.serializers.matchserializer import MatchSerializer

class RumbleWeekSerializer(serializers.ModelSerializer):
    matches = MatchSerializer(many=True)
    signups = RumbleSignupSerializer(many=True)

    class Meta:
        model = RumbleWeek
        fields = '__all__'

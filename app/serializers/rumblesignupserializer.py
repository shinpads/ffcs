from rest_framework import serializers

from .playerserializer import PlayerSerializer
from app.models import RumbleSignup

class RumbleSignupSerializer(serializers.ModelSerializer):
    player = PlayerSerializer()
    
    class Meta:
        model = RumbleSignup
        fields = '__all__'

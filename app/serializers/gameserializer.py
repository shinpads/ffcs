from rest_framework import serializers
from django.core.serializers import serialize
from .teamserializer import TeamSerializer
from ..models import Game

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'

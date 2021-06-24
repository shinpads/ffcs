from rest_framework import serializers
from django.core.serializers import serialize
from .matchserializer import MatchSerializerWithoutGames
from ..models import Game


class GameSerializerWithMatch(serializers.ModelSerializer):
    match = MatchSerializerWithoutGames(many=False)
    class Meta:
        model = Game
        fields = '__all__'

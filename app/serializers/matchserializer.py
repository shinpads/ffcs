from rest_framework import serializers
from django.core.serializers import serialize
from .teamserializer import TeamSerializer
from .gameserializer import GameSerializer
from ..models import Match

class MatchSerializer(serializers.ModelSerializer):
    teams = TeamSerializer(many=True)
    winner = TeamSerializer()
    games = GameSerializer(many=True)

    class Meta:
        model = Match
        fields = '__all__'

class MatchSerializerWithoutGames(serializers.ModelSerializer):
    teams = TeamSerializer(many=True)
    winner = TeamSerializer()

    class Meta:
        model = Match
        fields = '__all__'

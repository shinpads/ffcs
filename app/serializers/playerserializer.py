from rest_framework import serializers
from .userserializer import UserSerializer
from ..models import Player, User

class PlayerSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Player
        fields = '__all__'

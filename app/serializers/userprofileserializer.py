from rest_framework import serializers
from .playerserializer import PlayerSerializer
from ..models import User

class UserProfileSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True)

    class Meta:
        model = User
        exclude = ('password', )

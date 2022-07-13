from rest_framework import serializers
from django.core.serializers import serialize
from .playerserializer import PlayerSerializer
from ..models import Team

class TeamSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True)
    rumble_top = PlayerSerializer()
    rumble_jg = PlayerSerializer()
    rumble_mid = PlayerSerializer()
    rumble_adc = PlayerSerializer()
    rumble_supp = PlayerSerializer()
    captain = PlayerSerializer()

    class Meta:
        model = Team
        fields = '__all__'

from rest_framework import serializers
from ..models import PlayerChampionStats

class PlayerChampionStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerChampionStats
        fields = '__all__'

from rest_framework import serializers
from django.core.serializers import serialize
from ..models import Team

class RawTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'

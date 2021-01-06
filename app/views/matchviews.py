from ..models import Match
from ..serializers.matchserializer import MatchSerializer
from django.http import JsonResponse
from django.db import IntegrityError
from django.views import View
import json

class MatchesView(View):
    def get(self, request, *args, **kwargs):
        matches = Match.objects.all().order_by('scheduled_for', '-week')

        out_data = [MatchSerializer(match).data for match in list(matches)]

        return JsonResponse({
            "message": "success",
            "data": out_data,
        }, status=200)


class MatchView(View):
    def get(self, request, *args, **kwargs):
        return JsonResponse({
            "message": "not done yet",
            "data": None,
        })

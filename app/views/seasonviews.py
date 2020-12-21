from ..models import Season
from ..serializers.seasonserializer import SeasonSerializer
from django.http import JsonResponse
from django.db import IntegrityError
from django.views import View
import json

class SeasonView(View):

    def get(self, request, *args, **kwargs):
        data = json.loads(request.body)
        out_data = {}
        season_num = data['season']

        season = Season.objects.filter(number=season_num).first()
        if season == None:
            response = JsonResponse({
                "message": "could not find season with given number.",
                "data": {},
            }, status=500)
            return response
        
        out_data = SeasonSerializer(season).data

        response = JsonResponse({
            "message": "successfully found the season.",
            "data": out_data,
        }, status=200)
        return response
    
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        out_data = {}
        season_num = data['season']
        
        season = Season()
        season.number = season_num
        try:
            season.save()
        except IntegrityError as e:
            response = JsonResponse({
                "message": "An error has occured.",
                "error": e.args[0],
                "data": {},
            }, status=500)
            return response
        
        out_data = SeasonSerializer(season).data

        response = JsonResponse({
            "message": "Successfully created season.",
            "data": out_data,
        }, status=200)
        return response
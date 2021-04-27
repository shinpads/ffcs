from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from ..models import Vote, Season, User
from django.views import View
import json

class VoteView(View):
    def post(self, request, *args, **kwargs):
        user = request.user
        json_data = json.loads(request.body)
        current_season = Season.objects.get(number=json_data['season'])

        if Vote.objects.filter(user=user).exists():
            return JsonResponse({"message": "User already submitted vote"})

        vote = Vote()
        vote.user = user
        vote.season = current_season
        vote.save()

        return JsonResponse({"message": "Successfully added vote"})

    def get(self, request, *args, **kwargs):
        user = request.user

        if Vote.objects.filter(user=user).exists():
            return JsonResponse({"message": "User already submitted vote", "data": True})

        else:
            return JsonResponse({"message": "User has not submitted a vote", "data": False})

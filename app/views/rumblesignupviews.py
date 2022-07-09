from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from ..models import RumbleSignup, RumbleWeek
from django.views import View
import json

class RumbleSignupView(View):
    def post(self, request, *args, **kwargs):
        user = request.user
        json_data = json.loads(request.body)
        week = RumbleWeek.objects.get(id=json_data.get('week')['id'])

        rumble_player = next(
                filter(lambda player: player.is_rumble, user.players.all()),
                None
            )

        rumble_signup = RumbleSignup()
        rumble_signup.rumble_week = week
        rumble_signup.player = rumble_player
        rumble_signup.save()


    def get(self, request, *args, **kwargs):
        return

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from ..models import RumbleSignup, RumbleWeek
from ..serializers.rumbleweekserializer import RumbleWeekSerializer
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

        weeks = RumbleWeekSerializer(
            RumbleWeek.objects.all(),
            many=True
        ).data

        out_data = {
            'weeks': weeks
        }

        response = JsonResponse({
            "message": "Successfully registered for this week's rumble.",
            "data": out_data,
        }, status=200)
        return response
    
    def delete(self, request, *args, **kwargs):
        user = request.user
        json_data = json.loads(request.body)
        week = RumbleWeek.objects.get(id=json_data.get('week')['id'])

        rumble_player = next(
                filter(lambda player: player.is_rumble, user.players.all()),
                None
            )

        rumble_signup = RumbleSignup.objects.get(
            player=rumble_player,
            rumble_week=week
        )
        rumble_signup.delete()


        weeks = RumbleWeekSerializer(
            RumbleWeek.objects.all(),
            many=True
        ).data

        out_data = {
            'weeks': weeks
        }

        response = JsonResponse({
            "message": "Successfully deregistered for this week's rumble.",
            "data": out_data,
        }, status=200)
        return response


    def get(self, request, *args, **kwargs):
        return

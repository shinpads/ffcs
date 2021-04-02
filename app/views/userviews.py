from ..models import Player, Team, Season
from ..serializers.userserializer import UserSerializer
from django.http import JsonResponse
from django.views import View
from django.db import IntegrityError
import json, os
import requests

def get_from_session(request):
    user = request.user
    if user.is_anonymous:
        return JsonResponse({
            "message": "not logged in",
            "data": None
        }, status=200)

    out_data = UserSerializer(user).data

    return JsonResponse({
        "message": "success",
        "data": out_data,
    }, status=200)

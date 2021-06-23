from ..models import Player, Team, Season, User
from ..serializers.userserializer import UserSerializer
from ..serializers.userprofileserializer import UserProfileSerializer
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


def get_user(request, user_id):
    user = User.objects.get(pk=user_id)
    user_data = UserProfileSerializer(user).data

    return JsonResponse({
        "message": "success",
        "data": user_data,
    }, status=200)

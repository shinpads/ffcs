from django.http import JsonResponse
from ..models import Player
import json


def post_player(request, data):
    data = json.loads(data)
    
    p = Player()
    username = data['username']
    team_name = data['team']
    


    response = JsonResponse({
        "message": "successfully added player to database."
        "data": {}
    }, status=200)

    return response

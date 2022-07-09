from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from ..models import Player, RegistrationForm, Season
import json

@login_required(login_url="/")
def signup(request):
    user = request.user
    json_data = json.loads(request.body)
    current_season = Season.objects.get(is_current=True)

    form, created = RegistrationForm.objects.get_or_create(season=current_season, user=request.user)

    form.season = current_season
    form.user = request.user
    form.first_name = json_data['firstName']
    form.first_role = json_data['firstRole']
    form.second_role = json_data['secondRole']
    form.third_role = json_data['thirdRole']
    form.fourth_role = json_data['fourthRole']
    form.fifth_role = json_data['fifthRole']
    form.current_rank = json_data['rank']
    form.rank_should_be = json_data['rankShouldBe']
    form.heard_from = json_data['heardFrom']
    form.summoner_name = json_data['summonerName']
    form.wants_to_be_captain = json_data['isCaptain']

    form.save()
    return JsonResponse({ "message": "Registration Complete" });

@login_required(login_url="/")
def rumblesignup(request):
    user = request.user
    json_data = json.loads(request.body)
    rumble_season = Season.objects.get(is_rumble=True)

    form, created = RegistrationForm.objects.get_or_create(season=rumble_season, user=user)

    form.season = rumble_season
    form.user = request.user
    form.first_role, form.second_role, form.third_role, form.forth_role, form.fifth_rule = json_data['rolePreferences']
    form.current_rank = json_data['rank']
    form.highest_rank = json_data['highestRank']
    form.rank_should_be = json_data['rankShouldBe']
    form.heard_from = json_data['heardFrom']
    form.summoner_name = json_data['summonerName']

    form.save()
    if created:
        player = Player()
        player.user = user
        player.role_preferences = json_data['rolePreferences']
        player.is_rumble = True
        player.save()

    response = JsonResponse({
            "message": "Successfully signed up!"
        }, status=200)

    return response;

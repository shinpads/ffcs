from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from ..models import RegistrationForm, Season
import json

@login_required(login_url="/")
def signup(request):
    user = request.user
    json_data = json.loads(request.body)
    current_season = Season.objects.get(number=2)

    submitted_form = RegistrationForm.objects.filter(season=current_season, user=request.user)

    if len(submitted_form) > 0:
        return JsonResponse({ "message": "Already submitted for this season" })

    form = RegistrationForm(
        season=current_season,
        user=request.user,
        first_name=json_data['firstName'],
        first_role=json_data['firstRole'],
        second_role=json_data['secondRole'],
        third_role=json_data['thirdRole'],
        fourth_role=json_data['fourthRole'],
        fifth_role=json_data['fifthRole'],
        current_rank=json_data['rank'],
        rank_should_be=json_data['rankShouldBe'],
        heard_from=json_data['heardFrom'],
        summoner_name=json_data['summonerName']
    )
    form.save()
    return JsonResponse({ "message": "Registration Complete" });

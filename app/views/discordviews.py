from django.http import JsonResponse, HttpRequest
from django.views import View
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login
from ..models import User, Season, RegistrationForm
import json
import requests
import os
import logging

logger = logging.getLogger(__name__)

DISCORD_AUTH_URL = os.getenv('DISCORD_AUTH_URL')
DISCORD_CLIENT_ID = os.getenv('DISCORD_CLIENT_ID')
DISCORD_CLIENT_SECRET = os.getenv('DISCORD_CLIENT_SECRET')
DISCORD_REDIRECT_URI = os.getenv('DISCORD_REDIRECT_URI')

def discord_login(request: HttpRequest):
    if not request.session.session_key:
        request.session.save()

    return redirect(DISCORD_AUTH_URL)

def login_redirect(request: HttpRequest):
    code = request.GET['code']
    logger.error('\n\n\n\nGOT CODE')
    logger.error(code)
    discord_user_data = exchange_code(code)

    user = authenticate(request, user=discord_user_data)
    logger.error(user)
    login(request, user, backend='app.auth.DiscordAuthenticationBackend')

    current_season = Season.objects.get(number=2)

    submitted_form = RegistrationForm.objects.filter(season=current_season, user=request.user)

    if len(submitted_form) == 0:
        return redirect('/signup')

    return redirect('/')

def exchange_code(code: str):
    data = {
        'client_id': DISCORD_CLIENT_ID,
        'client_secret': DISCORD_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': DISCORD_REDIRECT_URI,
        'scope': 'identify email'
    }

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post('https://discord.com/api/oauth2/token', data=data, headers=headers)
    credentials = response.json();
    access_token = credentials['access_token']

    headers = {
        'Authorization': 'Bearer %s' % access_token
    }

    response = requests.get('https://discord.com/api/v6/users/@me', headers=headers)

    logger.error(response.json())

    return response.json()

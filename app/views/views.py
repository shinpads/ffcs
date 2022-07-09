from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from ..models import RegistrationForm, Season
import json

def index(request):
  return render(request, 'index.html')

@login_required(login_url="/")
def signup_index(request):
    return render(request, 'index.html')

@login_required(login_url="/")
def rumblesignup_index(request):
    return render(request, 'index.html')

@login_required(login_url="/")
def match_index(request, match_id):
    return render(request, 'index.html')

@login_required(login_url="/")
def user_index(request, user_id):
    return render(request, 'index.html')

@login_required(login_url="/")
def team_index(request, team_id):
    return render(request, 'index.html')



def riot(request):
  filename = "riot.txt"
  content = 'ac65f8e0-a217-46d7-a8e3-6fc4a8b576b7'
  response = HttpResponse(content, content_type='text/plain')
  response['Content-Disposition'] = 'attachment; filename={0}'.format(filename)
  return response

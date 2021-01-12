from django.shortcuts import render
from django.http import HttpResponse

def index(request):
  return render(request, 'index.html')

def riot(request):
  filename = "riot.txt"
  content = 'aewrhbaw'
  response = HttpResponse(content, content_type='text/plain')
  response['Content-Disposition'] = 'attachment; filename={0}'.format(filename)
  return response
<<<<<<< Updated upstream:foal_server/urls.py
"""foal_server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

admin.site.site_header = "FFCS Administration"
admin.site.site_title = "FFCS Administration Portal"
admin.site.index_title = "FFCS Administration Portal"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('app.urls'))
]
=======
from django.urls import path
from foal_server_app import views

urlpatterns = [
    path('api/get_team/<str:data>/', views.teamviews.get_team),
    path('api/post_team/<str:data>/', views.teamviews.post_team),
]
>>>>>>> Stashed changes:server/foal_server/foal_server/urls.py

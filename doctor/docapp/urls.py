"""
URL configuration for MAC project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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
from . import views
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    path('', views.index, name="Register"),
    path('login/', views.login, name="Login"),
    # path('dashboard/', views.dashboard, name="Dashboard"),
    path('patient/', include('patient.urls'), name='Patient'),
    path('stats/', include('stats.urls'), name='Stats'),
    path('settings/', include('settings.urls'), name='Settings'),
    # API End points for authenticated pages
    path('api/user/auth/email/', views.CheckEmailValidity, name='CheckEmail'),

    path('api/user/auth/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/user/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

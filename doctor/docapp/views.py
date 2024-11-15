from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
# from django.contrib.auth.models import User
from .models import User
import json
from django.http import JsonResponse
import random

# Create your views here.
def index(request):
    result = {"Error": False, "Message": ""}
    if request.method == 'POST':
        name = request.POST.get('txtName')
        surname = request.POST.get('txtSurname')
        email = request.POST.get('txtEmail')
        psw = request.POST.get('txtPsw')
        conpsw = request.POST.get('txtConfPsw')

        if psw and conpsw and psw != conpsw:
            result = {"Error": True, 'Message':'Password and Confirm Password does not match.'}
            return render(request, 'signup.html', {"result": result})
        else:
            docUser = User.objects.create_user(email, name, surname, psw)
            docUser.save()
            result = {"Error": False, 'Message':'You are registered successfully.'}
            return render(request, 'signup.html', {"result": result})
    return render(request, 'signup.html', {"result": result})

def login(request):
    return render(request, 'login.html')

def dashboard(request):
    return render(request, 'dashboard.html')
    # return render(request, 'dashboard_basic.html')

def CheckEmailValidity(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            user = User.objects.filter(email=email)
            user_count = user.count()
            if user_count > 0:
                # Users found
                user_list = list(user.values('id', 'name', 'email'))
                randCode = random.randrange(111111, 999999, 6)
                return JsonResponse({'status': 'OK', 'message': user_list, 'code': randCode })

            else:
                user_list = []
                return JsonResponse({'status': 'KO', 'message': 'EMAIL NON VALIDI', })
        except Exception as e:
            return JsonResponse({'status': 'KO', 'message': str(e)})
    return JsonResponse({'status': 'KO', 'message': 'Invalid request method'})

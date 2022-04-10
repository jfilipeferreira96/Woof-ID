from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import render, redirect, HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
import datetime
import json
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import User, WoofTag, Pet

# Create your views here.

def index(request):
    return render(request, "woofid/index.html", {
            
    })

def get_me_home(request):
    if request.method == "POST":
        body = json.loads(request.body.decode('utf-8'))
        
        try:
            pet = WoofTag.objects.get(woofid__iexact=body['woofid']).pet
            return JsonResponse({"message": "Success", 'info': pet.toJson()}, status=200)
        except WoofTag.DoesNotExist:
            return JsonResponse({"message": "Error"})
       
    return render(request, "woofid/get-me-home.html", {
    })


    

@login_required(login_url="/login")
def profile(request):
    
    total_pet_profiles = Pet.objects.filter(
        account=User.objects.get(pk=request.user.id)).count()

    total_woof_ids = WoofTag.objects.filter(
        user=User.objects.get(pk=request.user.id)).count()

    return render(request, "woofid/profile.html", {
        "total_pet_profiles": total_pet_profiles,
        "total_woof_ids": total_woof_ids

            
    })

@login_required(login_url="/login")
def authentication(request):
    
    if request.method == "PUT":
        body = json.loads(request.body.decode('utf-8'))
        #if the woofid isnt activated
        if len(WoofTag.objects.filter(
        woofid__iexact=body['woofid'], active=False)) > 0:

            #activate this woofid
            WoofTag.objects.filter(woofid__iexact=body['woofid']).update(active=True, activated_at=datetime.datetime.now(), user=User.objects.get(pk=request.user.id))
            return JsonResponse({"message": "Success"}, status=201)
        else:
            return JsonResponse({"message": "Error"})

    return render(request, "woofid/authentication.html", {
    })

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=User.objects.get(email=email).username, password=password)
        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "woofid/profile.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "woofid/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "woofid/register.html", {
                "message_pw": "Passwords must match."
            })

        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "woofid/register.html", {
                "message_user": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "woofid/register.html")

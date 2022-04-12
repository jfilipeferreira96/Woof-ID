from unicodedata import name
from django.db import models
from django.contrib.auth.models import AbstractUser
from django_countries.fields import CountryField
import json
from json import JSONEncoder

# Create your models here.
class User(AbstractUser):
    pass

    def __str__(self):
        return f"{self.username} ({self.id})"

class Pet(models.Model):
    pet_name = models.CharField(max_length=32, blank=False)
    image = models.ImageField(upload_to="media/",default='static/media/default.jpg')
    owner = models.CharField(max_length=32, blank=False)
    country = CountryField()
    zip_code = models.CharField(max_length=10, blank=False)
    address = models.CharField(max_length=254, blank=False)
    phone = models.CharField(max_length=14, blank=False)
    email = models.EmailField()
    additional = models.TextField( blank=False)
    account = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="account")
    

    def __str__(self):
        return f"{self.pet_name}"

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)


class WoofTag(models.Model):
    woofid = models.CharField(max_length=7, blank=False)
    pet = models.ForeignKey(
        Pet, on_delete=models.SET_NULL, blank=True,
        null=True)
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, blank=True,
        null=True)
    active = models.BooleanField(default=False)
    activated_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Woof collar id: {self.id}"
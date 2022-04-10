from django.contrib import admin
from .models import User, Pet, WoofTag
# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "password")

class PetAdmin(admin.ModelAdmin):
    list_display = ("id", "pet_name", "account")

class WoofTagAdmin(admin.ModelAdmin):
    list_display = ("id", "woofid", "pet", "user", "active", "activated_at")

    
admin.site.register(User, UserAdmin)
admin.site.register(Pet, PetAdmin)
admin.site.register(WoofTag, WoofTagAdmin)

from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("get-me-home", views.get_me_home, name="get_me_home"),
    path("profile", views.profile, name="profile"),
    path("authentication", views.authentication, name="authentication"),
    path("profile_keys", views.profile_keys, name="profile_keys"),
    path("available_keys", views.available_keys, name="available_keys"),
    path("edit_pet_profile/<int:pet_id>", views.edit_pet_profile, name="edit_pet_profile")


] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

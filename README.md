# Final Project

#### Installation

- Install project dependencies by running `pip install -r requirements.txt`. Dependencies include Django, Django-Countries and Pillow that allows Django to work with images.
- Make and apply migrations by running `python manage.py makemigrations` and `python manage.py migrate`.
- Create superuser with `python manage.py createsuperuser`. And register a Woof ID.
- Go to website address and register an account.

# Distinctiveness and Complexity

This project basically consists on a ID which is present on a pet collar/leash.
The idea is that if an animal gets lost, whoever finds it can access several information about its owner. Just by inserting a code (Woof ID) in this website.

#### Main ideia: The whole point is that the animal has its own page with lots of information on how to return the pet if it gets lost.

The application is fully mobile-responsive.
The application utilizes Django (3 models) on the backend and Javascript for the front-end.

1- User Model

2- Pet Model: An user can create multiple pets profiles. A pet profile is associated with ONLY ONE Woof Tag Id.

3- Woof Tag Model: Woof tag contains the Woof ID which is used to associate to a Pet and to find the pet information. It must be created by a super user, then activated by a user and finnally associated to a pet. An user can multiples woof tags.

# File structure description

```
├── pets/  -> core application
│   ├── asgi.py  -> asgi interface configuration
│   ├── settings.py -> global settings
│   └── urls.py  -> global urls mapping
├── woofid/  -> the main app
│   ├── static/
│   │   └── media -> contains every pet profile image
│   │   │
│   │   └── woofid/
│   │       ├── img/  -> folder which contains front-end images - static media
│   │       ├── main.css  -> main css
│   │       ├── main.js  -> main page
│   │       └── sign.css  -> css used for the register and login page
│   │
│   ├── templates/
│   │   └── woofid/
│   │       ├── layout.html  -> base template
│   │       ├── get-me-home.html  -> page that it's used to insert the Woof ID and find the information
│   │       ├── index.html  -> index page
│   │       ├── login.html  -> login page
│   │       ├── register.html  -> register page
│   │       ├── profile.html  -> user profile page
│   │       └── authentication.html  -> page that a user uses to activate his woof id
│   │
│   ├── admin.py
│   ├── apps.py
│   ├── models.py  -> app models
│   ├── urls.py  -> urls to the main app site (woofid)
│   └── views.py  -> website views and api endpoints
│
├── manage.py
├── README.md  -> readme file with the instructions
└── requirements.txt  -> file that contains the project dependencies
```

<br>
<br>

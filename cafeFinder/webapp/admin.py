from django.contrib import admin
from webapp.models import City, Cafe, Review, Country, Placetype

# Register your models here.

admin.site.register(City)
admin.site.register(Cafe)
admin.site.register(Review)
admin.site.register(Country)
admin.site.register(Placetype)
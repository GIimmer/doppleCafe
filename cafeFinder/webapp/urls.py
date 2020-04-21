from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from . import views

ROUTER = DefaultRouter()
ROUTER.register('cities', views.CityViewSet)

urlpatterns = [
    url(r'^cafes', views.cafe_search),
    url(r'^findSimilarCafes', views.find_similar_cafes),
    url(r'', include(ROUTER.urls))
]

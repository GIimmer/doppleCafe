from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from . import views

ROUTER = DefaultRouter()
ROUTER.register('cities', views.CityViewSet)

urlpatterns = [
    url(r'^cafes$', views.cafe_search),
    url(r'^cafes/(?P<cafe_id>[a-zA-Z0-9_-]+)$', views.get_cafe_details),
    url(r'^findSimilarCafes', views.find_similar_cafes),
    url(r'', include(ROUTER.urls))
]

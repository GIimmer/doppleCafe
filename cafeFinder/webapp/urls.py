from django.conf.urls import url, include
from webapp import views

urlpatterns = [
    url(r'^cities$', views.get_all_cities),
    url(r'^searchCity$', views.city_search),
    url(r'^searchCafe$', views.cafe_search),
    url(r'^cafes/(?P<cafe_id>[a-zA-Z0-9_-]+)$', views.get_cafe_details),
    url(r'^findSimilarCafes', views.find_similar_cafes),
    url(r'^exploreCity', views.exploreCity),
    url(r'^getWordBagRef', views.get_word_bag_ref),
]

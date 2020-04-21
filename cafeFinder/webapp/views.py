import json
from webapp.models import City, Cafe, Country, Review, Placetype
from django.core import serializers
from django.shortcuts import get_object_or_404
from django.db.models.query import QuerySet
from webapp.api.serializers import CitySerializer, CafeSerializer
from rest_framework import viewsets, mixins
from rest_framework.parsers import JSONParser
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from research.cafeTest import getNearestCafesGivenCafe, givenCityRunML
from research.apiHandlers import geocodeCityName, getCafeWithQueryString, getCafeDetailsGivenID, givenCafeRetrieveReviews, get60CafesNearCity

class CityViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin):
    serializer_class = CitySerializer
    queryset = City.objects.all()

    def retrieve(self, request, pk):
        queryset = self.queryset.filter(pk=pk)
        city = queryset.first()
        clustered_cafes = givenCityRunML(city, 5, 7)
        clustered_cafe_response = []
        for _, cafe_arr in clustered_cafes.items():
            clustered_cafe_response.append(CafeSerializer(cafe_arr, many=True).data)

        return JsonResponse(clustered_cafe_response, safe=False)

    def get_queryset(self):
        queryset = self.queryset
        if isinstance(queryset, QuerySet):
            # Ensure queryset is re-evaluated on each request.
            queryset = queryset.all()

        name = self.request.query_params.get('name', None)
        if (name is not None):
            queryset = queryset.filter(name=name)
            if (len(queryset) == 0):
                city_obj = geocodeCityName(name)
                queryset = [genCityFromAPISuggestion(city_obj)]

        return queryset

def cafe_search(request):
    query_string = request.GET.get('queryString', None)
    data = {}
    if query_string is not None:
        data = getCafeWithQueryString(query_string)
    return JsonResponse(data)

@csrf_exempt
@require_http_methods(["POST"])
def find_similar_cafes(request):
    request_body = json.loads(request.body)
    city_id = request_body.get('cityId', None)
    cafe_id = request_body.get('cafeId', None)
    if (city_id and cafe_id):
        try:
            city = City.objects.get(pk=city_id)
        except City.DoesNotExist:
            return JsonResponse({ "status": "Failed", "Reason": "City not in database" })

        try:
            target_cafe = Cafe.objects.get(place_id=cafe_id)
        except Cafe.DoesNotExist:
            cafe_details_res = getCafeDetailsGivenID(cafe_id)
            cafe_name = request_body.get('cafeName', None)
            cafe_addr = request_body.get('cafeAddr', None)
            target_cafe = genCafeFromDetailsRequest(cafe_details_res, cafe_id, cafe_name, cafe_addr)
        
        if target_cafe.review_set.count() == 0:
            givenCafeRetrieveReviews(target_cafe, 80)

        # Cafe.objects.filter(city=city).delete()
        if city.cafe_set.count() == 0:
            get60CafesNearCity(city)
 
        if (city.cafe_set.count() > 10):
            similar_cafes = getNearestCafesGivenCafe(city, target_cafe)

    return JsonResponse(CafeSerializer(similar_cafes, many=True).data, safe=False)


def genCityFromAPISuggestion(city_obj):
    try:
        country = Country.objects.get(countryCode=city_obj['country'])
    except Country.DoesNotExist:
        country = Country.objects.create(countryCode=city_obj['country'])
    return City.objects.create(name=city_obj['name'], country=country, latitude=city_obj['latitude'], longitude=city_obj['longitude'])

def genCafesFromAPICandidates(api_candidates):
    for candidate in api_candidates:
        Cafe.objects.create(place_id=candidate['place_id'], name=candidate['name'], address=candidate['formatted_address'])

def genCafeFromDetailsRequest(cafe_details_obj, cafe_id, cafe_name, cafe_addr):
    if (cafe_name is not None and cafe_addr is not None):

        place_type_arr = []
        for place_type in cafe_details_obj['types']:
            try:
                placetype_obj = Placetype.objects.get(name=place_type)
            except Placetype.DoesNotExist:
                placetype_obj = Placetype.objects.create(name=place_type)
            place_type_arr.append(placetype_obj)

        compound_code = cafe_details_obj['plus_code']['compound_code']
        cafe_details_obj.update({ "place_id": cafe_id, "name": cafe_name, "address": cafe_addr, "compound_code": compound_code })

        cafe_details_obj['hours'] = hoursArrStringFromHoursObj(cafe_details_obj)

        del cafe_details_obj['types']
        del cafe_details_obj['plus_code']
        del cafe_details_obj['opening_hours']

        cafe_obj = CafeSerializer(data=cafe_details_obj)
        if cafe_obj.is_valid(raise_exception=True):
            cafe_model = cafe_obj.save()
            for place_type in place_type_arr:
                cafe_model.placetypes.add(place_type)
        return cafe_obj

def hoursArrStringFromHoursObj(hours_obj):
    try:
        hours_arr = hours_obj['opening_hours']['periods']
        formatted_arr = []
        for day_obj in hours_arr:
            formatted_arr.append([day_obj['open']['time'], day_obj['close']['time']])
        return json.dumps(formatted_arr)
    except:
        return "unset"

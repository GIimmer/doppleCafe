import json
from functools import wraps
import os.path
import jwt
from rest_framework.decorators import api_view
from rest_framework import viewsets, mixins
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models.query import QuerySet
from django.db.models import Count
from django.conf import settings
from webapp.models import City, Cafe, Country, Placetype, Photo
from webapp.utils import remove_create_city_permissions, decode_token_auth_header
from webapp.api.serializers import CitySerializer, CafeSerializer, ReviewSerializer
from research.cafeTest import getNearestCafesGivenCafe, givenCityRunML
from research.apiHandlers import geocodeCityName, getCafeWithQueryString, getCafeDetailsGivenID, givenCafeRetrieveReviews, get60CafesNearCity
from research.utilities import getDataFromFileWithName

BASE = os.path.dirname(os.path.abspath(__file__))
IDX_WORD_MAP = getDataFromFileWithName(os.path.join(BASE, "../research/wordBagFiles/reverseWordVecMap"))
IDX_WORD_ARR = getDataFromFileWithName(os.path.join(BASE, "../research/wordBagFiles/reverseWordVecArr"))
NUM_TERMS_OF_TYPE_DICT = getDataFromFileWithName(os.path.join(BASE, "../research/wordBagFiles/numWeightedTerms"))

def requires_scope(required_scope):
    """Determines if the required scope is present in the Access Token
    Args: required_scope (str): The scope required to access the resource"""
    def require_scope(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            decoded = decode_token_auth_header(args[0])
            if decoded.get("scope"):
                token_scopes = decoded["scope"].split()
                for token_scope in token_scopes:
                    if token_scope == required_scope:
                        return f(*args, **kwargs)
            response = JsonResponse({'message': 'You don\'t have access to this resource'})
            response.status_code = 403
            return response
        return decorated
    return require_scope

@csrf_exempt
@require_http_methods(["GET"])
def get_all_cities(request):
    queryset = City.objects.all()
    queryset = queryset.annotate(cafe_count=Count('cafe')).filter(cafe_count__gt=4)
    return JsonResponse({ 'cities': CitySerializer(queryset, many=True).data })


# @csrf_exempt
@api_view(['GET'])
@requires_scope('create:city')
def city_search(request):
    query_string = request.GET.get('queryString', None)
    if query_string is not None:
        remove_create_city_permissions(request)
        city_obj = geocodeCityName(query_string)
        queryset = [genCityFromAPISuggestion(city_obj)]
    return CitySerializer(queryset, many=True).data

@csrf_exempt
def cafe_search(request):
    query_string = request.GET.get('queryString', None)
    data = {}
    if query_string is not None:
        data = getCafeWithQueryString(query_string)
    if (data.get('status', '400') == 'OK'):
        for cafe in data.get('candidates'):
            gencafeFromSearchRes(cafe)
    return JsonResponse(data)

def gencafeFromSearchRes(cafe):
    try:
        cafe = Cafe.objects.get(pk=cafe['place_id'])
    except Cafe.DoesNotExist:
        location = cafe['geometry']['location']
        photo_arr = cafe['photos']

        cafe_search_obj = {
            "place_id": cafe['place_id'],
            "formatted_address": cafe['formatted_address'],
            "name": cafe['name'],
            "lat": location['lat'],
            "lng": location['lng']
        }
        cafe_obj = CafeSerializer(data=cafe_search_obj)

        if cafe_obj.is_valid(raise_exception=True):
            cafe_model = cafe_obj.save()
            createPhotosForCafe(photo_arr, cafe_model)

@csrf_exempt
def get_cafe_details(request, cafe_id):
    try:
        cafe = Cafe.objects.get(pk=cafe_id)
    except Cafe.DoesNotExist:
        return JsonResponse({"status": "Failed", "Reason": "Cafe not in database"})
    # if True:
    if cafe.photo_set.count() == 0:
        cafe_details_res = getCafeDetailsGivenID(cafe_id)
        cafe.hours = hoursArrStringFromDetailsRes(cafe_details_res)
        createPhotosForCafe(cafe_details_res['photos'], cafe)
        cafe_loc = cafe_details_res['geometry']['location']
        cafe.lat = cafe_loc['lat']
        cafe.lng = cafe_loc['lng']

        attrs = ['formatted_phone_number', 'formatted_address', 'website', 'price_level']
        for attr in attrs:
            setattr(cafe, attr, cafe_details_res.get(attr, None))

        cafe.save()

    top_3_reviews = ReviewSerializer(cafe.review_set.all()[:3], many=True).data

    cafe_data = CafeSerializer(cafe).data
    cafe_data['reviews'] = top_3_reviews
    del cafe_data['raw_word_cloud']

    return JsonResponse(cafe_data, safe=False)

@csrf_exempt
@require_http_methods(["GET"])
def find_similar_cafes(request):
    city_id = request.GET.get('city', None)
    cafe_id = request.GET.get('cafe', None)
    weighting = request.GET.get('weight', None)
    if (city_id and cafe_id):
        try:
            city = City.objects.get(pk=city_id)
        except City.DoesNotExist:
            return JsonResponse({"status": "Failed", "Reason": "City not in database"})

        try:
            target_cafe = Cafe.objects.get(place_id=cafe_id)
        except Cafe.DoesNotExist:
            cafe_details_res = getCafeDetailsGivenID(cafe_id)
            target_cafe = imbueCafeWithDetailsRes(cafe_details_res, cafe_id)

        if target_cafe.review_set.count() == 0:
            givenCafeRetrieveReviews(target_cafe, 80)

        # Cafe.objects.filter(city=city).delete()
        if city.cafe_set.count() == 0:
            get60CafesNearCity(city)

        if (city.cafe_set.count() > 10):
            similar_cafe_wrapper = getNearestCafesGivenCafe(city, target_cafe, weighting)

        target_cafe_model = CafeSerializer(target_cafe).data
        similar_cafes = CafeSerializer(similar_cafe_wrapper['similar_cafes'], many=True).data
        common_terms_ref = {}
        common_terms_ref[1] = [IDX_WORD_MAP[str(term)] for term in similar_cafe_wrapper['common_terms'].keys()]
        city = CitySerializer(city).data
        for cafe in similar_cafes:
            if (cafe['hours'] != 'unset'):
                cafe['hours'] = json.loads(cafe['hours'])

    return JsonResponse({ 'target_cafe': target_cafe_model, 'cafe_list': similar_cafes, 'common_terms_ref': common_terms_ref, 'target_city': city })

@csrf_exempt
@require_http_methods(["GET"])
def exploreCity(request):
    city_id = request.GET.get('city', None)
    weighting = request.GET.get('weight', None)
    try:
        city = City.objects.get(pk=city_id)
    except City.DoesNotExist:
        return JsonResponse({"status": "Failed", "Reason": "City not in database"})

    clustered_cafes = givenCityRunML(city, 5, 9, weighting)
    clustered_cafe_response = []
    common_terms_ref = {}
    for idx, cafe_cluster in clustered_cafes.items():
        common_terms_ref[idx] = [IDX_WORD_MAP[str(item[0])] for item in cafe_cluster['common_terms']]
        clustered_cafe_response.append(CafeSerializer(cafe_cluster['cafes'], many=True).data)

    return JsonResponse({ 'cafe_list_of_lists': clustered_cafe_response, 'common_terms_ref': common_terms_ref })


@csrf_exempt
@require_http_methods(["GET"])
def get_word_bag_ref(request):
    return JsonResponse({
        'word_bag_arr': IDX_WORD_ARR,
        'num_weighted_terms': NUM_TERMS_OF_TYPE_DICT['all_terms'],
        'num_dn_terms': NUM_TERMS_OF_TYPE_DICT['dn_terms']
    })

def genCityFromAPISuggestion(city_obj):
    try:
        country = Country.objects.get(countryCode=city_obj['country'])
    except Country.DoesNotExist:
        country = Country.objects.create(countryCode=city_obj['country'])
    return City.objects.create(name=city_obj['name'], country=country, latitude=city_obj['latitude'], longitude=city_obj['longitude'])

def genCafesFromAPICandidates(api_candidates):
    for candidate in api_candidates:
        Cafe.objects.create(place_id=candidate['place_id'], name=candidate['name'], formatted_address=candidate['formatted_address'])

def imbueCafeWithDetailsRes(cafe_details_obj, cafe_id):
    cafe = Cafe.objects.get(pk=cafe_id)
    if (cafe is not None):
        cafe.compound_code = cafe_details_obj['plus_code']['compound_code']

        createPhotosForCafe(cafe_details_obj['photos'], cafe)
        cafe.hours = hoursArrStringFromDetailsRes(cafe_details_obj)

        place_type_arr = []
        for place_type in cafe_details_obj['types']:
            try:
                placetype_obj = Placetype.objects.get(name=place_type)
            except Placetype.DoesNotExist:
                placetype_obj = Placetype.objects.create(name=place_type)
            place_type_arr.append(placetype_obj)

        for place_type in place_type_arr:
            cafe.placetypes.add(place_type)

        return cafe

def createPhotosForCafe(photo_arr, cafe):
    for num, photo in enumerate(photo_arr):
        photo_arr[num] = Photo(
            height=photo['height'],
            width=photo['width'],
            photo_ref=photo['photo_reference'],
            html_attr=photo['html_attributions'][0],
            cafe=cafe
        )
    Photo.objects.bulk_create(photo_arr)


def hoursArrStringFromDetailsRes(details_res):
    try:
        hours_arr = details_res['opening_hours']['periods']
        formatted_arr = []
        for day_obj in hours_arr:
            formatted_arr.append([day_obj['open']['time'], day_obj['close']['time']])
        return json.dumps(formatted_arr)
    except:
        return "unset"

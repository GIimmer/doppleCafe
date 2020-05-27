import json
import os.path
from rest_framework import viewsets, mixins
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models.query import QuerySet
from django.db.models import Count
from webapp.models import City, Cafe, Country, Placetype, Photo
from webapp.api.serializers import CitySerializer, CafeSerializer, ReviewSerializer
from research.cafeTest import getNearestCafesGivenCafe, givenCityRunML
from research.apiHandlers import geocodeCityName, getCafeWithQueryString, getCafeDetailsGivenID, givenCafeRetrieveReviews, get60CafesNearCity
from research.utilities import getDataFromFileWithName

BASE = os.path.dirname(os.path.abspath(__file__))
REVERSE_IDX_WORD_REF = getDataFromFileWithName(os.path.join(BASE, "../research/reverseWordVecRef"))

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

        return JsonResponse({ 'cafe_list_of_lists': clustered_cafe_response })

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
        else:
            queryset = queryset.annotate(cafe_count=Count('cafe')).filter(cafe_count__gt=4)

        return CitySerializer(queryset, many=True).data

@csrf_exempt
def cafe_search(request):
    print('in cafe search with ', request)
    query_string = request.GET.get('queryString', None)
    data = {}
    if query_string is not None:
        data = getCafeWithQueryString(query_string)
    return JsonResponse(data)

@csrf_exempt
def get_cafe_details(request, cafe_id):
    try:
        cafe = Cafe.objects.get(pk=cafe_id)
    except Cafe.DoesNotExist:
        return JsonResponse({"status": "Failed", "Reason": "Cafe not in database"})
    # if True:
    if cafe.photo_set.count() == 0:
        cafe_details_res = getCafeDetailsGivenID(cafe_id)
        cafe.hours = hoursArrStringFromHoursObj(cafe_details_res)
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
    if cafe_data['hours'] != 'unset':
        cafe_data['hours'] = json.loads(cafe_data['hours'])

    return JsonResponse(cafe_data, safe=False)

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
            return JsonResponse({"status": "Failed", "Reason": "City not in database"})

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

        cafe_response = CafeSerializer(similar_cafes, many=True).data
        for cafe in cafe_response:
            if (cafe['hours'] != 'unset'):
                cafe['hours'] = json.loads(cafe['hours'])

    return JsonResponse({ 'cafe_list': cafe_response })


@csrf_exempt
@require_http_methods(["GET"])
def get_word_bag_ref(request):
    return JsonResponse({
        'word_bag_ref': REVERSE_IDX_WORD_REF
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

def genCafeFromDetailsRequest(cafe_details_obj, cafe_id, cafe_name, cafe_addr):
    if (cafe_name is not None and cafe_addr is not None):

        place_type_arr = []
        for place_type in cafe_details_obj['types']:
            try:
                placetype_obj = Placetype.objects.get(name=place_type)
            except Placetype.DoesNotExist:
                placetype_obj = Placetype.objects.create(name=place_type)
            place_type_arr.append(placetype_obj)

        photo_arr = cafe_details_obj['photos']

        compound_code = cafe_details_obj['plus_code']['compound_code']
        cafe_details_obj.update({ "place_id": cafe_id, "name": cafe_name, "formatted_adress": cafe_addr, "compound_code": compound_code })

        cafe_details_obj['hours'] = hoursArrStringFromHoursObj(cafe_details_obj)

        for field in ['types', 'plus_code', 'opening_hours', 'photos']:
            del cafe_details_obj[field]

        cafe_obj = CafeSerializer(data=cafe_details_obj)
        if cafe_obj.is_valid(raise_exception=True):
            cafe_model = cafe_obj.save()
            for place_type in place_type_arr:
                cafe_model.placetypes.add(place_type)

            createPhotosForCafe(photo_arr, cafe_model)

        return cafe_model

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


def hoursArrStringFromHoursObj(hours_obj):
    try:
        hours_arr = hours_obj['opening_hours']['periods']
        formatted_arr = []
        for day_obj in hours_arr:
            formatted_arr.append([day_obj['open']['time'], day_obj['close']['time']])
        return json.dumps(formatted_arr)
    except:
        return "unset"

"""This module handles logic around queries"""
import threading
import time
import math
import concurrent.futures
import logging

import numpy as np
import requests

from django.core.exceptions import ValidationError
from research.apiQueryBuilders import (buildAreaSearchRequest, buildWextractorDetailsRequest,
                                       buildSinglePlaceSearchRequest, buildSingleCafeDetailsRequest,
                                       buildCityLocationSearchRequest)
from research.utilities import makeAPIRequest
from webapp.models import Review, Cafe, Placetype

logger = logging.getLogger('debug')
THREAD_LOCAL = threading.local()
CAFE = None

def get_session():
    if not hasattr(THREAD_LOCAL, "session"):
        THREAD_LOCAL.session = requests.Session()
    return THREAD_LOCAL.session

def makeVariableAreaSearchRequest(city, radii):
    latitude = getattr(city, 'lat')
    longitude = getattr(city, 'lng')
    results_arr = None
    
    def makeRequestsWithRadius(radius):
        results_array = []
        page_token = None
        for i in range(3):
            area_request = None
            if i == 0:
                area_request = buildAreaSearchRequest(latitude, longitude, None, radius)
            else:
                area_request = buildAreaSearchRequest(None, None, page_token, radius)
            response = makeAPIRequest(area_request)
            area_results = response['results']
            results_array.extend(area_results)
            page_token = response.get('next_page_token', 0)
            if page_token == 0:
                break
            else:
                time.sleep(2)
        return results_array

    for idx, radius in enumerate(radii, start=1):
        results_arr = makeRequestsWithRadius(radius)
        if (len(results_arr) > 45 or idx == len(radii)):
            return results_arr, radius


def get60ResultsNearLocation(city):
    results_array, radius = makeVariableAreaSearchRequest(city, ['2500', '5000'])
    city.radius = int(radius)
    city.save()
    
    new_cafes = []
    new_cafe_placetypes = []
    existing_cafes = []
    for result in results_array:
        place_id = result['place_id']
        try:
            cafe = Cafe.objects.get(pk=place_id)
            existing_cafes.append(cafe)
        except Cafe.DoesNotExist:
            loc = result.get('geometry', {'location': {}}).get('location', {})
            cafe = Cafe(
                name=result['name'],
                place_id=place_id,
                compound_code=result.get('plus_code', {'compound_code': 'unset'})['compound_code'],
                lat=loc.get('lat', None),
                lng=loc.get('lng', None),
                price_level=result.get('price_level', None),
                rating=result.get('rating', None),
                user_ratings_total=result.get('user_ratings_total', None),
                city=city
            )
            try:
                cafe.clean_fields()
                place_type_arr = []
                for place_type in result['types']:
                    try:
                        placetype_obj = Placetype.objects.get(name=place_type)
                    except Placetype.DoesNotExist:
                        placetype_obj = Placetype.objects.create(name=place_type)
                    place_type_arr.append(placetype_obj)
                new_cafes.append(cafe)
                new_cafe_placetypes.append(place_type_arr)
            except ValidationError as err:
                print('issue with cafe: ', result['name'], err)

    Cafe.objects.bulk_create(new_cafes)

    ThroughModel = Cafe.placetypes.through
    through_model_arr = []
    for i in range(len(new_cafes)):
        cafe_id = getattr(new_cafes[i], 'place_id')
        through_model_arr = through_model_arr + [ThroughModel(cafe_id=cafe_id, placetype_id=getattr(placetype, 'pk')) for placetype in new_cafe_placetypes[i] ]
    ThroughModel.objects.bulk_create(through_model_arr)

    return new_cafes + existing_cafes

# getFirstNReviews - use multiples of 10
def givenCafeArrRetrieveReviews(cafe_arr, get_first_n_reviews):
    for cafe in cafe_arr:
        if cafe.review_set.count() == 0:
            givenCafeRetrieveReviews(cafe, get_first_n_reviews)
    return cafe_arr

def givenCafeRetrieveReviews(cafe, get_first_n_reviews):
    user_ratings = getattr(cafe, 'user_ratings_total')
    if user_ratings is None:
        return
    half_ratings_rounded_up = int(math.ceil(user_ratings / 20.0)) * 10
    smaller = half_ratings_rounded_up if half_ratings_rounded_up < get_first_n_reviews else get_first_n_reviews
    review_batch = np.arange(0, smaller, 10)
    global CAFE
    CAFE = cafe
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        all_reviews = list(executor.map(getReviewBatchAndConvertToModel, review_batch))
    flattened_all_reviews = [item for sublist in all_reviews for item in sublist]
    Review.objects.bulk_create(flattened_all_reviews)
    return flattened_all_reviews

def getReviewBatchAndConvertToModel(batch):
    session = get_session()
    with session.get(buildWextractorDetailsRequest(getattr(CAFE, 'place_id'), batch)) as response:
        review_arr = response.json()
        response_arr = []
        for review in review_arr['reviews']:
            review_obj = Review.create(review, CAFE)
            try:
                review_obj.clean_fields()
                response_arr.append(review_obj)
            except ValidationError as err:
                print("Error in getReviewBatchAndConvertToModel", err)
        return response_arr


def get60CafesNearCity(city):
    unfilled_cafe_array = get60ResultsNearLocation(city)
    cafe_array = givenCafeArrRetrieveReviews(unfilled_cafe_array, 80)
    return cafe_array

def geocodeCityName(city_name):
    success = False
    while not success:
        geocoded_city = makeAPIRequest(buildCityLocationSearchRequest(city_name))
        success = geocoded_city.get('success', True)
        if not success:
            time.sleep(2)
    new_city_obj = {
        "name": geocoded_city['standard']['city'],
        "country": geocoded_city['standard']['prov'],
        "latitude": geocoded_city['latt'],
        "longitude": geocoded_city['longt']
    }
    return new_city_obj


def getCafeWithQueryString(query_string):
    api_res = makeAPIRequest(buildSinglePlaceSearchRequest(query_string))
    return api_res

def getCafeDetailsGivenID(cafe_id):
    api_res = makeAPIRequest(buildSingleCafeDetailsRequest(cafe_id))

    if api_res['status'] == 'OK':
        result = api_res['result']
        return result
    else:
        return None

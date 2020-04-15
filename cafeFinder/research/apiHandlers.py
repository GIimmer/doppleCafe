"""This module handles logic around queries"""
from research.apiQueryBuilders import (buildSinglePlaceSearchRequest, buildCityLocationSearchRequest,
                        buildAreaSearchRequest, buildWextractorDetailsRequest, buildSingleCafeDetailsRequest)
from research.utilities import saveDataToFileWithName, getDataFromFileWithName, makeAPIRequest
import time

def get60ResultsNearLocation(lat, long):
    page_token = None
    results_array = []
    for i in range(3):
        area_request = None
        if i == 0:
            area_request = buildAreaSearchRequest(lat, long, None)
        else:
            area_request = buildAreaSearchRequest(None, None, page_token)
        response = makeAPIRequest(area_request)
        area_results = response['results']
        results_array.extend(area_results)
        page_token = response.get('next_page_token', 0)
        if page_token == 0:
            break
    return results_array

# getFirstNReviews - use multiples of 10
def givenCafeArrRetrieveReviews(cafe_arr, get_first_n_reviews):
    for cafe in cafe_arr:
        givenCafeRetrieveReviews(cafe, get_first_n_reviews)
    return cafe_arr

def givenCafeRetrieveReviews(cafe, get_first_n_reviews):
    review_arr = []
    for i in range(0, get_first_n_reviews, 10):
        details_res = makeAPIRequest(buildWextractorDetailsRequest(cafe['place_id'], i))
        review_arr.extend(details_res['reviews'])
    cafe['reviews'] = review_arr

def get60CafesNearCity(city_name):
    location_res = makeAPIRequest(buildCityLocationSearchRequest(city_name))
    latitude = location_res['latt']
    longitude = location_res['longt']

    unfilled_cafe_array = get60ResultsNearLocation(latitude, longitude)
    cafe_array = givenCafeArrRetrieveReviews(unfilled_cafe_array, 80)
    saveDataToFileWithName(cafe_array, 'temp' + city_name + 'Response')
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
    # api_res = makeAPIRequest(buildSingleCafeDetailsRequest(cafe_id))
    api_res = getDataFromFileWithName("cafeDetailsRes")
    
    if api_res['status'] == 'OK':
        result = api_res['result']
        return result
    else:
        return None
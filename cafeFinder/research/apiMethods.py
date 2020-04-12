import requests
from urllib.parse import quote
from constants import googlePlacesAPI, wextractorAPI, geocodeXYZAPI
from utilities import saveDataToFileWithName

def buildSinglePlaceSearchRequest(place_name):
    if (len(place_name) == 0):
        return
    else:
        place_name = quote(place_name)
        return googlePlacesAPI['urlPrefix'] + googlePlacesAPI['searchPlaceURLSuffix'] + f"inputtype=textquery&input={place_name}&fields=formatted_address,name,place_id"

def buildCityLocationSearchRequest(city_name):
    if (len(city_name) == 0):
        return
    else:
        city_name = quote(city_name)
        return geocodeXYZAPI['latLongFromPlaceNameURL'].format(cityName=city_name)

def buildAreaSearchRequest(lat, long, page_token):
    suffix = None
    if (page_token is not None):
        suffix = f"pagetoken={page_token}"
    else:
        suffix = f"location={lat},{long}&rankby=distance&type=cafe"
    return googlePlacesAPI['urlPrefix'] + googlePlacesAPI['searchAreaURLSuffix'] + suffix

def get60ResultsNearLocation(lat, long):
    page_token = None
    results_array = []
    for i in range(3):
        area_request = None
        if i == 0:
            area_request = buildAreaSearchRequest(lat, long, None)
        else:
            area_request = buildAreaSearchRequest(None, None, page_token)
        response = requests.get(area_request).json()
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
        details_request = buildWextractorDetailsRequest(cafe['place_id'], i)
        details_res = requests.get(details_request).json()
        review_arr.extend(details_res['reviews'])
    cafe['reviews'] = review_arr

def buildWextractorDetailsRequest(place_id, offset):
    if(len(place_id) == 0):
        return
    else:
        return wextractorAPI['detailsURLPrefix'] + wextractorAPI['detailsURLSuffix'].format(id=place_id, offset=offset)


def get60CafesNearCity(city_name):
    location_req = buildCityLocationSearchRequest(city_name)
    location_res = requests.get(location_req).json()
    latitude = location_res['latt']
    longitude = location_res['longt']

    unfilled_cafe_array = get60ResultsNearLocation(latitude, longitude)
    cafe_array = givenCafeArrRetrieveReviews(unfilled_cafe_array, 80)
    saveDataToFileWithName(cafe_array, 'temp' + city_name + 'Response')
    return cafe_array
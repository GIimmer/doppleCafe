"""This module builds the querystring to be requested"""
from urllib.parse import quote
from globalVals.constants import GOOGLEPLACESAPI, WEXTRACTORAPI, GEOCODEXYZAPI

def buildSinglePlaceSearchRequest(place_name):
    if len(place_name) == 0:
        return
    else:
        place_name = quote(place_name)
        return GOOGLEPLACESAPI['urlPrefix'] + GOOGLEPLACESAPI['searchPlaceURLSuffix'] + \
               f"inputtype=textquery&input={place_name}&fields=place_id,name,formatted_address,geometry,photos"

def buildCityLocationSearchRequest(city_name):
    if len(city_name) == 0:
        return
    else:
        city_name = quote(city_name)
        return GEOCODEXYZAPI['latLongFromPlaceNameURL'].format(cityName=city_name)

def buildAreaSearchRequest(lat, long, page_token, radius):
    suffix = None
    if page_token is not None:
        suffix = f"pagetoken={page_token}"
    else:
        suffix = f"location={lat},{long}&radius={radius}&rankby=prominence&type=cafe"
    return GOOGLEPLACESAPI['urlPrefix'] + GOOGLEPLACESAPI['searchAreaURLSuffix'] + suffix

def buildWextractorDetailsRequest(place_id, offset):
    if len(place_id) == 0:
        return
    else:
        return WEXTRACTORAPI['detailsURLPrefix'] + WEXTRACTORAPI['detailsURLSuffix'].format(id=place_id, offset=offset)

def buildCafeBasicDetailsRequest(cafe_id):
    if len(cafe_id) == 0:
        return
    else:
        suffix = GOOGLEPLACESAPI['placeBasicDetailsRequestedFeatures'].format(cafe_id=cafe_id)
        return GOOGLEPLACESAPI['urlPrefix'] + GOOGLEPLACESAPI['placeDetailsURLSuffix'] + suffix 

def buildSingleCafeDetailsRequest(cafe_id):
    if len(cafe_id) == 0:
        return
    else:
        suffix = GOOGLEPLACESAPI['placeDetailsRequestedFeatures'].format(cafe_id=cafe_id)
        return GOOGLEPLACESAPI['urlPrefix'] + GOOGLEPLACESAPI['placeDetailsURLSuffix'] + suffix
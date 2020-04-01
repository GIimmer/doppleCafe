import requests
from urllib.parse import quote
from constants import googlePlacesAPI, wextractorAPI, geocodeXYZAPI

def buildSinglePlaceSearchRequest(placeName):
    if (len(placeName) == 0):
        return
    else:
        placeName = quote(placeName)
        return googlePlacesAPI['urlPrefix'] + googlePlacesAPI['searchPlaceURLSuffix'] + f"inputtype=textquery&input={placeName}&fields=formatted_address,name,place_id"

def buildCityLocationSearchRequest(cityName):
    if (len(cityName) == 0):
        return
    else:
        cityName = quote(cityName)
        return geocodeXYZAPI['latLongFromPlaceNameURL'].format(cityName=cityName)

def buildForAreaSearchRequest(lat, long, pagetoken):
    suffix = None
    if (pagetoken != None):
        suffix = f"pagetoken={pagetoken}"
    else:
        suffix = f"location={lat},{long}&rankby=distance&type=cafe"
    return googlePlacesAPI['urlPrefix'] + googlePlacesAPI['searchAreaURLSuffix'] + suffix

def get60ResultsNearLocation(lat, long):
    pageToken = None
    resultsArray = []
    for i in range(3):
        areaRequest = None
        if i == 0:
            areaRequest = buildForAreaSearchRequest(lat, long, None)
        else:
            areaRequest = buildForAreaSearchRequest(None, None, pageToken)
        response = requests.get(areaRequest).json()
        areaResults = response['results']
        resultsArray.extend(areaResults)
        pageToken = response.get('next_page_token', 0)
        if pageToken == 0:
            break
    return resultsArray

# getFirstNReviews - use multiples of 10
def givenCafesRetrieveReviews(cafeArr, getFirstNReviews):
    for cafe in cafeArr:
        reviewArr = []
        for i in range(0, getFirstNReviews, 10):
            detailsRequest = buildWextractorDetailsRequest(cafe['place_id'], i)
            detailsRes = requests.get(detailsRequest).json()
            reviewArr.extend(detailsRes['reviews'])
        cafe['reviews'] = reviewArr
    return cafeArr

def buildWextractorDetailsRequest(placeId, offset):
    if(len(placeId) == 0):
        return
    else:
        return wextractorAPI['detailsURLPrefix'] + wextractorAPI['detailsURLSuffix'].format(id=placeId, offset=offset)
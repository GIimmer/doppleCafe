import requests
import json
import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt

from environment import testEnv
from urllib.parse import quote

baseURLPrefix = 'https://maps.googleapis.com/maps/api/place/'
baseURLSuffix = f"/json?key={testEnv['key']}&"

def buildRequestForPlaceSearchWithName(name):
    if (len(name) == 0):
        return
    else:
        name = quote(name)
        return baseURLPrefix + 'findplacefromtext' + baseURLSuffix + f"inputtype=textquery&input={name}&fields=formatted_address,name,place_id"

def buildRequestForPlaceDetailsWithPlaceId(placeId):
    if(len(placeId) == 0):
        return
    else:
        return baseURLPrefix + 'details' + baseURLSuffix + f"place_id={placeId}&fields=type,vicinity,opening_hours,price_level,rating,review,user_ratings_total"

# requestURL = buildRequestForPlaceSearchWithName("Chocolati Greenwood")

# targetCafe = requests.get(requestURL).json()
# with open('data.txt', 'w') as outfile:
#     json.dump(res, outfile)
targetCafeResponse = None
with open('targetCafeSearch.txt') as json_file:
    targetCafeResponse = json.load(json_file)

targetCafePossibilities = targetCafeResponse['candidates']
targetCafe = targetCafePossibilities[0]
targetCafeId = targetCafe['place_id']

detailsRequest = buildRequestForPlaceDetailsWithPlaceId(targetCafeId)
detailsResponse = requests.get(detailsRequest).json()
with open('targetCafeDetails.txt', 'w') as outfile:
    json.dump(detailsResponse, outfile)
hey = 'yo'





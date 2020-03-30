import requests
import functools
import json
import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt

from urllib.parse import quote
from environment import testEnv
from constants import googlePlacesAPI, wextractorAPI, geocodeXYZAPI
from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
from nltk.tokenize import regexp_tokenize

ps = PorterStemmer()
sw = stopwords.words("english")

vectorIdxRef = {}
with open('wordVectorIdxRef') as json_file:
    vectorIdxRef = json.load(json_file)
wordBagLen = len(vectorIdxRef)


def buildRequestForSinglePlaceSearchWithText(placeName):
    if (len(placeName) == 0):
        return
    else:
        placeName = quote(placeName)
        return googlePlacesAPI['urlPrefix'] + googlePlacesAPI['searchPlaceURLSuffix'] + f"inputtype=textquery&input={placeName}&fields=formatted_address,name,place_id"

def buildRequestForCityLocationSearch(cityName):
    if (len(cityName) == 0):
        return
    else:
        cityName = quote(cityName)
        return geocodeXYZAPI['latLongFromPlaceNameURL'].format(cityName=cityName)

def buildRequestForAreaSearch(lat, long, pagetoken):
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
            areaRequest = buildRequestForAreaSearch(lat, long, None)
        else:
            areaRequest = buildRequestForAreaSearch(None, None, pageToken)
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

def processAreaSearch(rawCafeArr):
    arrayOfCafeObjects = []
    for cafe in rawCafeArr:
        cafeObj = {
            "name": cafe.get('name', -1),
            "place_id": cafe.get('place_id', -1),
            "price_level": cafe.get('price_level', -1),
            "rating": cafe.get('rating', -1),
            "types": cafe.get('types', -1),
            "user_ratings_total": cafe.get('user_ratings_total', -1)
        }
        if cafeObj.get('place_id', -1) != -1:
            arrayOfCafeObjects.append(cafeObj)
    return arrayOfCafeObjects

def buildVectorFromCafe(cafeObj):
    reviewText = combineReviewText(cafeObj['reviews'])
    vectorizedText = convertTextToTFVector(reviewText)

    return vectorizedText

def combineReviewText(reviewArr):
    finalText = ''
    for review in reviewArr:
        finalText += (' ' + review['text'])
    return finalText

def convertTextToTFVector(text):
    text = text.lower()
    wordArr = regexp_tokenize(text, r"\w+")
    freqDict = stemAndRemoveStopwordsFromStringArr(wordArr)
    cafeReviewsLen = functools.reduce(lambda a,b : a+b,freqDict.values())

    vect = np.zeros(wordBagLen)
    for key, val in freqDict.items():
        try:
            idxOfKeyInVector = vectorIdxRef[key]
            vect[idxOfKeyInVector] = (val/cafeReviewsLen)
        except:
            print(key)
            
    return vect

def stemAndRemoveStopwordsFromStringArr(stringArr):
    uniqueWords = {}

    for word in stringArr:
        w = ps.stem(word)
        uniqueWords.setdefault(w, 0)
        uniqueWords[w] += 1

    for stopWord in sw:
        if stopWord in uniqueWords:
            del uniqueWords[stopWord] 

    return uniqueWords

cafeArr = None
with open('trainingSet.txt') as json_file:
    cafeArr = json.load(json_file)

lol = 'hey'





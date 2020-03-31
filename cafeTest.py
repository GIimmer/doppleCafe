import requests
import functools
import json
import copy
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

def processCafeArray(cafeArr):
    cafesToStrip = []
    reviewVectors = []
    for cafe in cafeArr:
        res = vectorizeCafeReviews(cafe)
        if len(res) > 0:
            reviewVectors.append(res)
        else:
            cafesToStrip.append(cafe)

    for cafe in cafesToStrip:
        cafeArr.remove(cafe)

    tfIDFVectors = processReviews(reviewVectors)
    return tfIDFVectors

def processReviews(reviewVectors):
    ReviewVectors = np.matrix(reviewVectors)
    numReviews = ReviewVectors.shape[0]
    logicalVectors = ReviewVectors != 0
    docFreq = logicalVectors.sum(axis=0)

    def calculateIDF(x):
        return np.log(numReviews/(x + 1)) + 1
    calculateIDF = np.vectorize(calculateIDF)
    idf = calculateIDF(docFreq)
    return np.multiply(ReviewVectors, idf)

def vectorizeCafeReviews(cafeObj):
    reviewText = combineReviewText(cafeObj['reviews'])
    if len(reviewText) == 0:
        return []
    vectorizedText = convertTextToTFVector(reviewText)
    cafeObj['reviewVect'] = vectorizedText

    return vectorizedText

def combineReviewText(reviewArr):
    finalText = ''
    for review in reviewArr:
        reviewText = review['text']
        if len(reviewText) > 0:
            finalText += (' ' + reviewText)
    return finalText

def convertTextToTFVector(text):
    text = text.lower()
    wordArr = regexp_tokenize(text, r"\w+")
    freqDict = stemAndRemoveStopwordsFromStringArr(wordArr)
    cafeReviewsLen = functools.reduce(lambda a,b : a+b,freqDict.values())

    vect = np.zeros(wordBagLen)
    for key, val in freqDict.items():
        idx = vectorIdxRef.get(key, -1)
        if idx != -1:
            vect[idx] = (val/cafeReviewsLen)     
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

def initCentroids(X, K):
    centroidIdxs = np.random.choice(X.shape[0], K, replace=False)
    centroids = copy.deepcopy(X[centroidIdxs])
    return centroids

def findClosestCentroids(X, centroids):
    reviewCount = X.shape[0]
    centroidNum = centroids.shape[0]
    closestCentroidVector = np.zeros(reviewCount, dtype=np.int8)
    for i in range(reviewCount):
        dupedReview = np.repeat(X[i], centroidNum, 0)
        bitwiseDistance = np.square(dupedReview - centroids).sum(axis=1)
        idxOfClosest = np.argmin(bitwiseDistance)
        closestCentroidVector[i] = idxOfClosest
    return closestCentroidVector

def computeNewCentroids(X, membership, K):
    m, n = X.shape

    arrMembership = membership.reshape(-1,1)
    intComparator = np.arange(5).reshape(1,-1)
    logicalFilter = np.equal(arrMembership, intComparator)

    vectorSum = np.transpose(logicalFilter) * X
    membershipTotal = logicalFilter.sum(axis=0).reshape(-1,1)
    newCentroids = np.divide(vectorSum, membershipTotal)
    return newCentroids

def runKMeans(X, K, maxIterations):
    m, n = X.shape

    centroids = initCentroids(X, K)
    prevCentroids = centroids
    centroidMembership = np.zeros(m, dtype=np.int8)

    for i in range(maxIterations):
        centroidMembership = findClosestCentroids(X, centroids)
        centroids = computeNewCentroids(X, centroidMembership, K)
    
    return (centroidMembership, centroids)


cafeArr = None
with open('trainingSet.txt') as json_file:
    cafeArr = json.load(json_file)

X = processCafeArray(cafeArr)
centroidMembership, centroids = runKMeans(X, 5, 10)

lol = 'hey'





import functools
import numpy as np

from utilities import getDataFromFileWithName, saveDataToFileWithName

from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
from nltk.tokenize import regexp_tokenize

ps = PorterStemmer()
sw = stopwords.words("english")

vectorIdxRef = getDataFromFileWithName('wordVectorIdxRef')
wordBagLen = len(vectorIdxRef)

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
    for idx, cafe in enumerate(cafeArr):
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
    if len(reviewText) <= 400:
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

def updateWordVectorWithFile(fileName='processedMostCommonWords.txt', stemWords=False):
    vectorIdxRef = {}
    wordArray = getDataFromFileWithName(fileName)
    if (stemWords == True):
        for idx, word in enumerate(wordArray):
            wordArray[idx] = ps.stem(word)
        wordArray = list(dict.fromkeys(wordArray)) # remove dupes
    for idx, val in enumerate(wordArray):
        vectorIdxRef[val] = idx
    
    saveDataToFileWithName(vectorIdxRef, 'wordVectorIdxRef')
    wordBagLen = len(vectorIdxRef)
    
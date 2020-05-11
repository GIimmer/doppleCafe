import os.path
import functools
import numpy as np
from django.core.cache import caches

from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
from nltk.tokenize import regexp_tokenize

from research.utilities import getDataFromFileWithName, saveDataToFileWithName

BASE = os.path.dirname(os.path.abspath(__file__))
CACHE = caches['city_vecs']

ps = PorterStemmer()
SW = stopwords.words("english")

VECTOR_IDX_REF = getDataFromFileWithName(os.path.join(BASE, "wordVectorIdxRef"))
WORD_BAG_LEN = len(VECTOR_IDX_REF)

def processAreaSearch(raw_cafe_arr):
    array_of_cafe_objects = []
    for cafe in raw_cafe_arr:
        cafe_obj = {
            "name": cafe.get('name', -1),
            "place_id": cafe.get('place_id', -1),
            "price_level": cafe.get('price_level', -1),
            "rating": cafe.get('rating', -1),
            "types": cafe.get('types', -1),
            "user_ratings_total": cafe.get('user_ratings_total', -1)
        }
        if cafe_obj.get('place_id', -1) != -1:
            array_of_cafe_objects.append(cafe_obj)
    return array_of_cafe_objects

def getTFVectorsFromCafeArr(cafe_arr, city_id=None):
    cafes_to_strip = []
    review_vectors = np.zeros(shape=(len(cafe_arr), WORD_BAG_LEN))

    next_vec_idx = 0
    for cafe in cafe_arr:
        res = vectorizeCafeReviews(cafe)
        if len(res) > 0:
            review_vectors[next_vec_idx] = res
            next_vec_idx += 1
        else:
            cafes_to_strip.append(cafe)

    for cafe in cafes_to_strip:
        cafe_arr.remove(cafe)

    if len(cafes_to_strip) != 0:
        review_vectors = review_vectors[0:-len(cafes_to_strip)]

    CACHE.set('vector_for_' + city_id, review_vectors, None)
    CACHE.set(("cafe_ids_for_" + city_id), [getattr(cafe, 'place_id') for cafe in cafe_arr], None)

    return review_vectors

def getIDFFromTFVectors(tfVectors):
    return processReviews(tfVectors)

def processReviews(review_vectors):
    num_reviews = len(review_vectors)
    logical_vectors = review_vectors != 0
    doc_freq = logical_vectors.sum(axis=0)

    def calculateIDF(x):
        return np.log(num_reviews/(x + 1)) + 1
    calculateIDF = np.vectorize(calculateIDF)
    idf = calculateIDF(doc_freq)
    return np.multiply(review_vectors, idf)

def vectorizeCafeReviews(cafe):
    review_text = combineReviewText(cafe.review_set.all())
    if len(review_text) <= 400:
        return []
    vectorized_text = convertTextToTFVector(review_text)

    return vectorized_text

def combineReviewText(review_arr):
    final_text = ''
    for review in review_arr:
        review_text = getattr(review, 'text')
        if len(review_text) > 0:
            final_text += (' ' + review_text)
    return final_text

def convertTextToTFVector(text):
    text = text.lower()
    word_arr = regexp_tokenize(text, r"\w+")
    freq_dict = stemAndRemoveStopwordsFromStringArr(word_arr)
    cafe_reviews_len = functools.reduce(lambda a, b : a+b, freq_dict.values())

    vect = np.zeros(WORD_BAG_LEN)
    for key, val in freq_dict.items():
        idx = VECTOR_IDX_REF.get(key, -1)
        if idx != -1:
            vect[idx] = (val/cafe_reviews_len)
    return vect

def stemAndRemoveStopwordsFromStringArr(string_arr):
    unique_words = {}

    for word in string_arr:
        w = ps.stem(word)
        unique_words.setdefault(w, 0)
        unique_words[w] += 1

    for stop_word in SW:
        if stop_word in unique_words:
            del unique_words[stop_word] 

    return unique_words

def updateWordVectorWithFile(file_name='processedMostCommonWords.txt', stem_words=False):
    global VECTOR_IDX_REF
    global WORD_BAG_LEN
    VECTOR_IDX_REF = {}
    word_array = getDataFromFileWithName(file_name)
    if (stem_words):
        for idx, word in enumerate(word_array):
            word_array[idx] = ps.stem(word)
        word_array = list(dict.fromkeys(word_array)) # remove dupes
    for idx, val in enumerate(word_array):
        VECTOR_IDX_REF[val] = idx
    
    saveDataToFileWithName(VECTOR_IDX_REF, 'wordVectorIdxRef')
    WORD_BAG_LEN = len(VECTOR_IDX_REF)
    
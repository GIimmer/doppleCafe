import os, sys
from nltk.stem import PorterStemmer
from cafeFinder.research.utilities import getDataFromFileWithName, saveDataToFileWithName
from wordBagData import FOOD_TERMS, AMBIENCE_TERMS, DN_TERMS

sys.path.append(os.getcwd())
ps = PorterStemmer()

def stemWordsInArrays(arr_arr, remove_dupes=False):
    for idx, arr in enumerate(arr_arr):
        arr_arr[idx] = [ps.stem(word) for word in arr]
        if remove_dupes:
            arr_arr[idx] = list(dict.fromkeys(arr))
    return arr_arr

PREV_WORD_BAG = getDataFromFileWithName('cafeFinder/research/wordBagFiles/wordVectorIdxRef')
WORD_BAG_DICT = dict.fromkeys(PREV_WORD_BAG)

FOOD_TERMS_STEMMED, AMBIENCE_TERMS_STEMMED, DN_TERMS_STEMMED = stemWordsInArrays([FOOD_TERMS, AMBIENCE_TERMS, DN_TERMS], True)
ALL_WEIGHTED_TERMS = FOOD_TERMS_STEMMED + AMBIENCE_TERMS_STEMMED + DN_TERMS_STEMMED

for term in ALL_WEIGHTED_TERMS:
    term_in_dict = WORD_BAG_DICT.get(term, False)
    if term_in_dict:
        del WORD_BAG_DICT[term]

NEW_WORD_BAG_LIST = list(WORD_BAG_DICT)
ALL_TERMS = NEW_WORD_BAG_LIST + ALL_WEIGHTED_TERMS

NEW_TERM_IDX_REF = {term: idx for idx, term in enumerate(ALL_TERMS)}
NEW_IDX_TERM_REF = {idx: term for idx, term in enumerate(ALL_TERMS)}

saveDataToFileWithName(NEW_TERM_IDX_REF, 'cafeFinder/research/wordBagFiles/wordVectorIdxRef')
saveDataToFileWithName(NEW_IDX_TERM_REF, 'cafeFinder/research/wordBagFiles/reverseWordVecRef')


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
    
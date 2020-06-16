import os, sys
sys.path.append(os.getcwd())

from nltk.stem import PorterStemmer
from cafeFinder.research.utilities import getDataFromFileWithName, saveDataToFileWithName
from wordBagData import FOOD_TERMS, AMBIENCE_TERMS, DN_TERMS

ps = PorterStemmer()

def stemWordsInArrays(tuple_arr, remove_dupes=False):
    res_arr = []
    for idx, term_tuple in enumerate(tuple_arr):
        term_arr = term_tuple[1]
        res_arr.append([ps.stem(word) for word in term_arr])
        if remove_dupes:
            res_arr[idx] = list(dict.fromkeys(res_arr[idx]))

        saveDataToFileWithName(res_arr[idx], 'cafeFinder/research/wordBagFiles/' + term_tuple[0] + 'Terms')

    return res_arr

def editVectorRefs():
    PREV_WORD_BAG = getDataFromFileWithName('cafeFinder/research/wordBagFiles/wordBagList')
    WORD_BAG_DICT = dict.fromkeys(PREV_WORD_BAG, True)

    TERM_TUPLES = [['food', FOOD_TERMS], ['ambience', AMBIENCE_TERMS], ['dn', DN_TERMS]]
    FOOD_STEMMED, AMBIENCE_STEMMED, DN_STEMMED = stemWordsInArrays(TERM_TUPLES, True)
    ALL_WEIGHTED_TERMS = FOOD_STEMMED + AMBIENCE_STEMMED + DN_STEMMED

    for term in ALL_WEIGHTED_TERMS:
        term_in_dict = WORD_BAG_DICT.get(term, False)
        if term_in_dict:
            del WORD_BAG_DICT[term]

    NEW_WORD_BAG_LIST = list(WORD_BAG_DICT)
    ALL_TERMS = NEW_WORD_BAG_LIST + ALL_WEIGHTED_TERMS

    NEW_TERM_IDX_REF = {term: idx for idx, term in enumerate(ALL_TERMS)}
    NEW_IDX_TERM_REF = {idx: term for idx, term in enumerate(ALL_TERMS)}

    saveDataToFileWithName(NEW_WORD_BAG_LIST, 'cafeFinder/research/wordBagFiles/wordBagList')
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
    
def reverseIdxToProperEnglish():
    term_list = getDataFromFileWithName('currentlyUnusedData/10kMostCommonWords.txt')
    term_idx_ref = getDataFromFileWithName('cafeFinder/research/wordBagFiles/wordVectorIdxRef')
    idx_term_ref = getDataFromFileWithName('cafeFinder/research/wordBagFiles/reverseWordVecRef')
    ALL_WEIGHTED_TERMS = FOOD_TERMS + AMBIENCE_TERMS + DN_TERMS
    MOST_TO_LEAST_IMPORTANT = ALL_WEIGHTED_TERMS + term_list

    MOST_TO_LEAST_IMPORTANT.reverse()

    for word in MOST_TO_LEAST_IMPORTANT:
        stemmed_term = ps.stem(word)
        idx_of_term = term_idx_ref.get(stemmed_term, None)
        if (idx_of_term != None):
            idx_term_ref[str(idx_of_term)] = word
    
    saveDataToFileWithName(idx_term_ref, 'cafeFinder/research/wordBagFiles/reverseWordVecRefTest')
    

reverseIdxToProperEnglish()
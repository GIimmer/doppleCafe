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
        stemmed_term_arr = [ps.stem(word) for word in term_arr]
        pos_and_neg_term_arr = ["not_" + term for term in stemmed_term_arr] + stemmed_term_arr

        if remove_dupes:
            pos_and_neg_term_arr = list(dict.fromkeys(pos_and_neg_term_arr))
        res_arr.append(pos_and_neg_term_arr)

        saveDataToFileWithName(res_arr[idx], 'cafeFinder/research/wordBagFiles/' + term_tuple[0] + 'Terms')

    return res_arr

def editVectorRefs():
    prev_word_bag = getDataFromFileWithName('cafeFinder/research/wordBagFiles/wordBagList')
    word_bag_dict = dict.fromkeys(prev_word_bag, True)

    term_tuples = [['food', FOOD_TERMS], ['ambience', AMBIENCE_TERMS], ['dn', DN_TERMS]]
    food_stemmed, ambience_stemmed, dn_stemmed = stemWordsInArrays(term_tuples, True)
    all_weighted_terms = food_stemmed + ambience_stemmed + dn_stemmed

    for term in all_weighted_terms:
        term_in_dict = word_bag_dict.get(term, False)
        if term_in_dict:
            del word_bag_dict[term]

    new_word_bag_list = list(word_bag_dict)
    all_terms = new_word_bag_list + all_weighted_terms

    new_term_idx_ref = {term: idx for idx, term in enumerate(all_terms)}
    new_idx_term_ref = {idx: term for idx, term in enumerate(all_terms)}

    saveDataToFileWithName(new_word_bag_list, 'cafeFinder/research/wordBagFiles/wordBagList')
    saveDataToFileWithName(new_term_idx_ref, 'cafeFinder/research/wordBagFiles/wordVectorIdxRef')
    saveDataToFileWithName(new_idx_term_ref, 'cafeFinder/research/wordBagFiles/reverseWordVecRef')

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
    all_weighted_terms = FOOD_TERMS + AMBIENCE_TERMS + DN_TERMS
    most_to_least_important = all_weighted_terms + term_list

    most_to_least_important.reverse()

    for word in most_to_least_important:
        stemmed_term = ps.stem(word)
        idx_of_term = term_idx_ref.get(stemmed_term, None)
        if (idx_of_term is not None):
            idx_term_ref[str(idx_of_term)] = word
    
    saveDataToFileWithName(idx_term_ref, 'cafeFinder/research/wordBagFiles/reverseWordVecRef')
    

reverseIdxToProperEnglish()
# editVectorRefs()
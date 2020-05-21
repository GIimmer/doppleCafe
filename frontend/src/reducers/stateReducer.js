import {
    FINDING_MOST_SIMILAR,
    SIMILAR_CAFES_FOUND,
    CLEAR_SEARCH,
    PERMISSION_UPDATED,
    TAB_SWITCHED
} from '../constants/ActionConstants'
import { snakeToCamel } from '../utilities/utilities'
import { Map, List, fromJS } from 'immutable'

function createSimilarCafes(cafeCandidates) {
    return cafeCandidates.map((cafe, idx) => {
        let jsObj = {
            similarityRank: idx + 1
        }

        Object.keys(cafe).forEach(key => jsObj[snakeToCamel(key)] = cafe[key]);
        
        return jsObj;
    })
}

function clearLockState(objectArr) {
    return objectArr.map(res => res.delete('locked'));
}

function clearData(state) {
    return state.merge({
        searchParamsSet: false,
        similarCafesFound: false,
        cityResponse: List(),
        cafeResponse: List(),
        cityLock: Map(),
        cafeLock: Map()
    });
}

export default (state = Map({}), action) => {
    console.log("state store recieved an action: ", action);
    switch (action.type) {
        case FINDING_MOST_SIMILAR:
            return state.set('searchParamsSet', true);

        case SIMILAR_CAFES_FOUND:
            let wordBagRef = action.payload.word_bag_ref;
            const intKeyValPair = Object.keys(wordBagRef).map(function (key) { 
                return [Number(key), wordBagRef[key]]; 
            }); 
            return state.merge({
                'wordBagRef': Map(intKeyValPair),
                'similarCafesFound': true,
                'similarCafes': fromJS(createSimilarCafes(action.payload.cafe_list))
            })

        case CLEAR_SEARCH:
            return state.merge({
                'cityLock': Map(),
                'cafeLock': Map(),
                'searchParamsSet': false,
                'searchParamsLocked': false,
                'cafeResponse': clearLockState(state.get('cafeResponse')),
                'cityResponse': clearLockState(state.get('cityResponse')),
            })

        case PERMISSION_UPDATED:
            return state.set('userCanLoadNewCity', action.userCanLoadCities > 0);

        case TAB_SWITCHED:
            return clearData(state).set('currentTab', action.payload.newTab);

        default:
            return state;
    }
};
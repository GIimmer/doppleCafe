import {
    FINDING_MOST_SIMILAR,
    SIMILAR_CAFES_FOUND,
    CLEAR_SEARCH,
    PERMISSION_UPDATED,
    TAB_SWITCHED
} from '../constants/ActionConstants'
import { Map, List } from 'immutable'

function createSimilarCafes(cafeCandidates) {
    return Map(cafeCandidates.map((cafe, idx) => {
        let jsObj = {
            similarityRank: idx + 1
        }

        Object.keys(cafe).forEach(key => jsObj[snakeToCamel(key)] = cafe[key]);
        
        return jsObj;
    }))
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
    switch (action.type) {
        case FINDING_MOST_SIMILAR:
            return state.set('searchParamsSet', true);

        case SIMILAR_CAFES_FOUND:
            return state.merge({
                'wordBagRef': action.payload.word_bag_ref,
                'similarCafesFound': true,
                'similarCafes': createSimilarCafes(action.payload.cafe_list)
            })

        case CLEAR_SEARCH:
            return state.merge({
                'cityLock': {},
                'cafeLock': {},
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
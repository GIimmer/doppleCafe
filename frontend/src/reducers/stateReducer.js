import {
    FINDING_MOST_SIMILAR,
    SIMILAR_CAFES_FOUND,
    CLEAR_SEARCH,
    PERMISSION_UPDATED,
    TAB_SWITCHED,
    GETTING_CITY_DATA,
    CITY_DATA_RETURNED
} from '../constants/ActionConstants'
import { snakeToCamel } from '../utilities/utilities'
import { prepareDetailsPhotos } from './outcomeReducer'
import { Map, List, fromJS } from 'immutable'

function processReturnedCafes(candidatesArrArr, cafeLocMap, forMostSimilar) {
    return candidatesArrArr.map((group, idg) => {
        return group.map((cafe, idc) => {
            let jsObj = forMostSimilar ? {
                similarityRank: idc + 1
            } : {};
    
            Object.keys(cafe).forEach(key => {
                if (key === 'photos') {
                    cafe[key] = prepareDetailsPhotos(cafe[key])
                }
                jsObj[snakeToCamel(key)] = cafe[key]
            });
            cafeLocMap[jsObj.placeId] = [idg, idc];
            
            return jsObj;
        })
    })
}

function clearLockState(objectArr) {
    return objectArr.map(res => res.delete('locked'));
}

function clearData(state) {
    return state.merge({
        searchParamsSet: false,
        cafesReturned: false,
        cityResponse: List(),
        cafeResponse: List(),
        cityLock: Map(),
        cafeLock: Map()
    });
}

function handleReturnedCafes(cafeListOfLists, forSimilar) {
    let cafeLocMap = {};
    return {
        'cafesReturned': true,
        'returnedCafes': fromJS(processReturnedCafes(cafeListOfLists, cafeLocMap, forSimilar)),
        'cafeLocMap': fromJS(cafeLocMap)
    };
}


export default (state = Map({}), action) => {
    console.log("state store recieved an action: ", action);
    switch (action.type) {
        case FINDING_MOST_SIMILAR:
            return state.set('searchParamsSet', true);

        case SIMILAR_CAFES_FOUND:
            const update_obj = handleReturnedCafes([[action.payload.target_cafe], action.payload.cafe_list], true)
            return state.merge(
                Object.assign({
                    'cafeLock': fromJS(action.payload.target_cafe),
                    'cityLock': fromJS(action.payload.target_city)
                }, update_obj)
            )

        case CLEAR_SEARCH:
            return state.merge({
                'cityLock': Map(),
                'cafeLock': Map(),
                'searchParamsSet': false,
                'searchParamsLocked': false,
                'cafesReturned': false,
                'returnedCafes': [],
                'cafeResponse': clearLockState(state.get('cafeResponse')),
                'cityResponse': clearLockState(state.get('cityResponse'))
            })

        case PERMISSION_UPDATED:
            return state.set('userCanLoadNewCity', action.userCanLoadCities > 0);

        case GETTING_CITY_DATA:
            let cityLock = state.get('preLoadedCities').find(city => city.get('id') === parseInt(action.payload));
            return state.merge({
                'searchParamsSet': true,
                'cityLock': cityLock
            });

        case CITY_DATA_RETURNED:
            return state.merge(
                handleReturnedCafes(action.payload.cafe_list_of_lists, false)
            )
        
        case TAB_SWITCHED:
            return clearData(state);

        default:
            return state;
    }
};
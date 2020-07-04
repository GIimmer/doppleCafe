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

function processReturnedCafes(candidatesArrArr, cafeLocMap, dnScoreLocArr, forMostSimilar) {
    return candidatesArrArr.map((group, idg) => {
        return group.map((cafe, idc) => {
            let jsObj = forMostSimilar && idg > 0 ? {
                similarityRank: idc + 1
            } : {};
    
            Object.keys(cafe).forEach(key => {
                if (key === 'photos') {
                    cafe[key] = prepareDetailsPhotos(cafe[key])
                }
                jsObj[snakeToCamel(key)] = cafe[key]
            });
            let cafeLoc = [idg, idc]
            cafeLocMap[jsObj.placeId] = cafeLoc;
            dnScoreLocArr.push([jsObj.dnScore, cafeLoc])
            
            return jsObj;
        })
    })
}

function clearData(state) {
    return state.merge({
        cafesReturned: false,
        returnedCafes: List(),
        cityResponse: List(),
        cafeResponse: List(),
        cityLock: Map(),
        cafeLock: Map(),
        highlightedCafe: null,
        filteringByTerms: List(),
        cafeFilter: null,
        cafeDetails: Map(),
        idToCafeMapper: Map(),
        commonTermsRefMap: Map()
    });
}

function handleReturnedCafes(cafeListOfLists, rawCommonTermsRefMap, forSimilar) {
    let cafeLocMap = {},
        dnScoreLocArr = [],
        commonTermsRefMap = {};
        
    Object.keys(rawCommonTermsRefMap).forEach((key) => {
        commonTermsRefMap[key] = rawCommonTermsRefMap[key].reduce((o, key, tIdx) => ({ ...o, [key]: tIdx + 1 }), {})
    });
    if (forSimilar) {
        commonTermsRefMap[0] = commonTermsRefMap[1];
    }
    let returnedCafes = processReturnedCafes(cafeListOfLists, cafeLocMap, dnScoreLocArr, forSimilar);
    dnScoreLocArr.sort((a, b) => b[0] - a[0]);

    for (let i = 0; i < 3; i++) {
        let loc = dnScoreLocArr[i][1],
            cafeInQuestion = returnedCafes[loc[0]][loc[1]];
        cafeInQuestion.dnPodium = i + 1
    }
    return {
        'cafesReturned': true,
        'returnedCafes': fromJS(returnedCafes),
        'commonTermsRefMap': fromJS(commonTermsRefMap),
        'cafeLocMap': fromJS(cafeLocMap)
    };
}


export default (state = Map({}), action) => {
    console.log("state store recieved an action: ", action);
    switch (action.type) {
        case FINDING_MOST_SIMILAR:
            return state;

        case SIMILAR_CAFES_FOUND:
            const update_obj = handleReturnedCafes([[action.payload.target_cafe], action.payload.cafe_list], action.payload.common_terms_ref, true)
            return state.merge(
                Object.assign({
                    'cafeLock': fromJS(action.payload.target_cafe),
                    'cityLock': fromJS(action.payload.target_city)
                }, update_obj)
            )

        case CLEAR_SEARCH:
            return clearData(state);

        case PERMISSION_UPDATED:
            return state.set('userCanLoadNewCity', action.userCanLoadCities > 0);

        case GETTING_CITY_DATA:
            let cityLock = state.get('preLoadedCities').find(city => city.get('id') === parseInt(action.payload));
            return state.merge({
                'cityLock': cityLock
            });

        case CITY_DATA_RETURNED:
            return state.merge(
                handleReturnedCafes(action.payload.cafe_list_of_lists, action.payload.common_terms_ref, false),
            )
        
        case TAB_SWITCHED:
            return clearData(state);

        default:
            return state;
    }
};
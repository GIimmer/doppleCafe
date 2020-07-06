import {
    CAFE_HOVER,
    CAFE_UNHOVER,
    GETTING_CAFE_DETAILS,
    CAFE_DETAILS_RETURNED,
    HIGHLIGHT_CAFE,
    WORD_BAG_REF_RETURNED,
    TOGGLE_HIGHLIGHT_RW_FRIENDLY,
    SET_TERM_FILTER,
    REMOVE_TERM_FILTER,
    SET_TERM_PRESENCE_REF,
    CLEAR_ALL_TERM_FILTERS,
    MAP_MARKER_CLICKED
  } from '../constants/ActionConstants'
  
import { snakeToCamel } from '../utilities/utilities'
import { Map, fromJS, List } from 'immutable'


export function prepareDetailsPhotos(photos) {
    return photos.map((photo) => {
        return {
            fromGoogle: true,
            height: photo.height,
            width: photo.width,
            ref: photo.photo_ref,
            attr: photo.html_attr
        }
    })
}

function imbueCafeDetails(cafe, newDetails) {
    let detailedCafeObj = {
        detailsLoaded: true
    };
    for (let key of Object.keys(newDetails)) {
        if (key === 'photos') {
            detailedCafeObj[key] = fromJS(prepareDetailsPhotos(newDetails[key]));
            continue;
        }
        let newKey = snakeToCamel(key);
        detailedCafeObj[newKey] = fromJS(newDetails[key]);
    }
    return cafe.merge(detailedCafeObj);
}

function getCafeFilter(state, termFilters) {
    const termToCafesMap = state.get('termToCafesMap');
    let cafeFilter;

    termFilters.forEach((term, idx) => {
        let cafesWithTerm = termToCafesMap.get(term).toJS();
        if (idx === 0) {
            cafeFilter = cafesWithTerm;
        } else {
            cafeFilter = cafeFilter.filter(cafe => cafesWithTerm.includes(cafe));
        }
    })
    return fromJS(cafeFilter);
}

export default (state = Map({}), action) => {
    let cafeDetails,
        weightedTerms;
    switch (action.type) {
        case WORD_BAG_REF_RETURNED:
            const wordBagArr = action.payload.word_bag_arr,
                weightedTermsStartIdx = (wordBagArr.length - action.payload.num_weighted_terms);
            weightedTerms = wordBagArr.slice(weightedTermsStartIdx);
            const dnTerms = weightedTerms.slice(weightedTerms.length - action.payload.num_dn_terms)
            const intKeyValPair = wordBagArr.map((val, idx) => { 
                return [idx, val]
            }); 
            return state.merge({
                'wordBagRef': Map(intKeyValPair),
                'weightedTerms': List(weightedTerms),
                'dnTerms': List(dnTerms)
            })

        case SET_TERM_PRESENCE_REF:
            const allCafes = state.get('returnedCafes');
            const termToCafesMap = {};
            const wordBagRef = state.get('wordBagRef');
            weightedTerms = state.get('weightedTerms');
            weightedTerms.forEach((term) => {
                termToCafesMap[term] = [];
            });
    
            allCafes.forEach((group) => {
                group.forEach((cafe) => {
                    let cafeCloud = cafe.get('rawWordCloud');
                    cafeCloud.forEach((termValArr) => {
                        let termIdx = termValArr.get(0),
                            term = wordBagRef.get(termIdx);
                        
                        if (termToCafesMap[term]) {
                            termToCafesMap[term].push(cafe.get('placeId'));
                        }
                    })
                })
            })
            return state.set('termToCafesMap', fromJS(termToCafesMap));

        case CAFE_HOVER:
        case MAP_MARKER_CLICKED:
            const cafeId = action.payload;
            cafeDetails = state.get('cafeDetails');

            if (cafeDetails.get('cafeId') !== cafeId) {
                const cafeinQuestion = !!cafeDetails.get(cafeId) ?
                cafeDetails.get(cafeId)
                :
                state.get('returnedCafes').getIn(state.getIn(['cafeLocMap', cafeId]).toJS());
                
                return state.mergeIn(['cafeDetails'], {
                    'state': CAFE_HOVER,
                    [cafeId]: cafeinQuestion,
                    'cafeId': cafeId
                })
            }
            return state;
        
        case CAFE_UNHOVER:
            cafeDetails = state.get('cafeDetails');
            const viewingCafe = cafeDetails.get(cafeDetails.get('cafeId'));

            if (cafeDetails.get('state') !== CAFE_DETAILS_RETURNED && (!viewingCafe || !viewingCafe.get('detailsLoaded'))) {
                return state.mergeIn(['cafeDetails'],
                    { 'state': null, 'cafeId': null }
                )
            }
            return state;

        case GETTING_CAFE_DETAILS:
            return state.mergeIn(['cafeDetails'], {
                'cafeId': action.payload,
                'state': action.type
            })

        case CAFE_DETAILS_RETURNED:
            cafeDetails = state.get('cafeDetails');
            const returnedCafeId = cafeDetails.get('cafeId');
            const cafeInQuestion = cafeDetails.get(returnedCafeId);
            
            return state.mergeIn(['cafeDetails'], {
                'state': action.type,
                [returnedCafeId]: imbueCafeDetails(cafeInQuestion, action.payload),
                'photos': prepareDetailsPhotos(cafeInQuestion.get('photos'))
            })

        case HIGHLIGHT_CAFE:
            return state.set('highlightedCafe', action.payload);

        case TOGGLE_HIGHLIGHT_RW_FRIENDLY:
            return state.set('highlightRWFriendly', action.payload);

        case SET_TERM_FILTER:
            let termFilters = state.get('filteringByTerms');
            let updatedTermFilters = termFilters.push(action.payload);
            return state.merge({
                'filteringByTerms': updatedTermFilters,
                'cafeFilter': getCafeFilter(state, updatedTermFilters)
            })

        case REMOVE_TERM_FILTER:
            let trmFilterList = state.get('filteringByTerms').filter((term) => term !== action.payload);
            return state.merge({ 'filteringByTerms': trmFilterList, 'cafeFilter': getCafeFilter(state, trmFilterList) });

        case CLEAR_ALL_TERM_FILTERS:
            return state.merge({
                'filteringByTerms': List(),
                'cafeFilter': null
            })
                
        default:
            return state;
    }
};
import {
    CAFE_HOVER,
    CAFE_UNHOVER,
    GETTING_CAFE_DETAILS,
    CAFE_DETAILS_RETURNED,
    HIGHLIGHT_CAFE,
    WORD_BAG_REF_RETURNED,
    TOGGLE_HIGHLIGHT_RW_FRIENDLY,
    SET_TERM_FILTER,
    REMOVE_TERM_FILTER
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

export default (state = Map({}), action) => {
    const cafeDetails = state.get('cafeDetails');
    switch (action.type) {
        case WORD_BAG_REF_RETURNED:
            const wordBagArr = action.payload.word_bag_arr,
                weightedTermsStartIdx = (wordBagArr.length - action.payload.num_weighted_terms),
                weightedTerms = wordBagArr.slice(weightedTermsStartIdx);
            const intKeyValPair = wordBagArr.map((val, idx) => { 
                return [idx, val]
            }); 
            return state.merge({
                'wordBagRef': Map(intKeyValPair),
                'weightedTerms': weightedTerms
            })

        case CAFE_HOVER:
            const cafeId = action.payload;
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
            const returnedCafeId = cafeDetails.get('cafeId'),
                cafeInQuestion = cafeDetails.get(returnedCafeId);
            
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
            if (action.payload === null) {
                return state.set('filteringByTerms', List());
            } else {
                let termFilterList = state.get('filteringByTerms');
                return state.set('filteringByTerms', termFilterList.push(action.payload));
            }

        case REMOVE_TERM_FILTER:
            let trmFilterList = state.get('filteringByTerms');
            return state.set('filteringByTerms', trmFilterList.filter((term) => term !== action.payload));
                
        default:
            return state;
    }
};
import {
    CAFE_HOVER,
    CAFE_UNHOVER,
    GETTING_CAFE_DETAILS,
    CAFE_DETAILS_RETURNED,
    HIGHLIGHT_CAFE
  } from '../constants/ActionConstants'
  
import { snakeToCamel } from '../utilities/utilities'
import { Map } from 'immutable'


function prepareDetailsPhotos(photos) {
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
    for (let key of Object.keys(newDetails)) {
        let newKey = snakeToCamel(key);
        cafe.set(newKey, newDetails[key]);
    }
    return cafe.set('detailsLoaded', true);
}

export default (state = Map({}), action) => {
    switch (action.type) {
        case CAFE_HOVER:
            const cafeId = action.payload,
                cafeDetails = state.get('cafeDetails');
            if (cafeDetails.get('cafeId') !== cafeId) {
                return cafeDetails.merge({
                    'state': CAFE_HOVER,
                    cafeId: state.get('similarCafes').find((cafe) => cafe.placeId === cafeId),
                    'cafeId': cafeId
                })
            }
            return state;
        
        case CAFE_UNHOVER:
            const cafeDetails = state.get('cafeDetails'),
                viewingCafe = cafeDetails.get('cafeId');
            if (cafeDetails.get('state') !== CAFE_DETAILS_RETURNED && (!viewingCafe || !viewingCafe.get(detailsLoaded))) {
                return state.mergeIn(
                    ['cafeDetails'],
                    cafeDetails => cafeDetails.merge({ 'state': null, 'cafeId': null })
                )
            }
            return state;

        case GETTING_CAFE_DETAILS:
            return state.mergeIn(['cafeDetails'], cafeDetails => cafeDetails.merge({
                'cafeId': action.payload,
                'state': action.type
            }))

        case CAFE_DETAILS_RETURNED:
            const cafeDetails = state.get('cafeDetails'),
                cafeId = cafeDetails.get('cafeId'),
                cafeInQuestion = cafeDetails.get(cafeId);
            
            return state.mergeIn(['cafeDetails'], cafeDetails => cafeDetails.merge({
                'state': action.type,
                cafeId: imbueCafeDetails(cafeInQuestion, action.payload),
                'photos': prepareDetailsPhotos(cafeInQuestion.get('photos'))
            }))

        case HIGHLIGHT_CAFE:
            return state.set('highlightedCafe', action.payload);
                
        default:
            return state;
    }
};
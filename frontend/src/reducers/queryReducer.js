import {
    GETTING_CAFE_OPTIONS,
    GETTING_CITY_OPTIONS,
    CAFE_OPTIONS_RETURNED,
    CITY_OPTIONS_RETURNED,
    CAFE_OPTION_LOCKED,
    CITY_OPTION_LOCKED,
    PRELOADED_CITY_SELECTED,
    CAFE_OPTION_UNLOCKED,
    CITY_OPTION_UNLOCKED,
    CLEAR_CAFE_MESSAGES,
    CLEAR_CITY_MESSAGES
  } from '../constants/ActionConstants'
  import { Map, List, fromJS } from 'immutable'

function createCafes(cafeCandidates) {
    return fromJS(cafeCandidates.map((cafe) => {
        let location = cafe.geometry.location,
            photo = cafe.photos ? cafe.photos[0] : null;
        return {
            placeId: cafe.place_id,
            name: cafe.name,
            lat: location.lat,
            lng: location.lng,
            photo: photo ? {
                fromGoogle: true,
                height: photo.height,
                width: photo.width,
                ref: photo.photo_reference,
                attr: photo.html_attributions[0]
            } : { ref: "https://cdn.pixabay.com/photo/2017/05/11/08/17/coffee-2303271_960_720.jpg", fromGoogle: false }
        }
    }))
}
  
function toggleLockState(objectArr = List([]), lockedId=null, forCafes=false) {
    if (lockedId === null) {
        return objectArr.map(res => res.delete('locked'));
    } else {
        return objectArr.map((object) => {
            let objectId = forCafes ? object.get('placeId') : object.get('id');
            if (objectId === lockedId) {
                return object.set('locked', true);
            } else {
                return object.set('locked', false);
            }
        })
    }
}

function createCity(city) {
    return Map({
        id: city.placeId,
        name: city.name,
        lat: city.latitude,
        lng: city.longitude,
        country: city.country
    })
}

function filterMessages(state, propName, ids) {
    return state.get(propName).filter((message) => !ids.includes(message.id));
}

export default (state = Map({}), action) => {
    switch (action.type) {
        case GETTING_CAFE_OPTIONS:
            return state.set('cafeQueryState', action.type);

        case CAFE_OPTIONS_RETURNED:
            const cafe = createCafes(action.payload.candidates);
            return state.merge({
                "cafeQueryState": action.type,
                "cafeResponse": cafe
            })

        case CAFE_OPTION_LOCKED:
            const CafeResponse = state.get('cafeResponse');
            const ToggledResponse = toggleLockState(CafeResponse, action.payload.placeId, true);
            return state.merge({
                'cafeLock': fromJS(action.payload),
                'cafeResponse': ToggledResponse
            });

        case PRELOADED_CITY_SELECTED:
            let cityOption = action.payload;
            const SelectedCity = state.get('preLoadedCities').filter((city) => {
                return (city.get('country') === cityOption.country && city.get('name') === cityOption.name);
            });
            return state.set('cityResponse', SelectedCity);

        case CAFE_OPTION_UNLOCKED:
            return state.merge({
                'cafeLock': Map(),
                'cafeResponse': toggleLockState(state.get('cafeResponse'))
            })

        case CLEAR_CAFE_MESSAGES:
            return state.set('cafeMessages', filterMessages(state.get('cafeMessages')));

        case GETTING_CITY_OPTIONS:
            return state.set('cityQueryState', action.type);

        case CITY_OPTIONS_RETURNED:
            return state.merge({
                'cityQueryState': action.type,
                'cityResponse': createCity(action.payload)
            });

        case CITY_OPTION_LOCKED:
            const CityResponse = state.get('cityResponse');
            if (!CityResponse.size) {
                CityResponse.push(action.payload);
            }
            return state.merge({
                'cityLock': fromJS(action.payload),
                'cityResponse': toggleLockState(CityResponse, action.payload.id)
            });

        case CITY_OPTION_UNLOCKED:
            return state.merge({
                'cityLock': Map(),
                'cityResponse': toggleLockState(state.get('cityResponse'))
            });

        case CLEAR_CITY_MESSAGES:
            return filterMessages(state, 'cityMessages', action.payload);
        
        default:
            return state;
    }
};
import { GETTING_CITY_OPTIONS,
    CITY_OPTIONS_RETURNED,
    CAFE_OPTION_LOCKED,
    CITY_OPTION_LOCKED,
    PRELOADED_CITY_SELECTED,
    CAFE_OPTION_UNLOCKED,
    CITY_OPTION_UNLOCKED,
    CLEAR_CAFE_MESSAGES,
    CLEAR_CITY_MESSAGES,
    PRELOADED_CITIES_RETURNED,
    CAFE_OPTION_SELECTED,
    HYDRATE_CAFE_OPTION
  } from '../constants/ActionConstants'
import CONSTS from '../constants/Constants'
import { Map, List, fromJS } from 'immutable'


export const getGooglePhotoFromJson = (photo) => ({
    fromGoogle: true,
    height: photo.height,
    width: photo.width,
    ref: photo.photo_ref,
    attr: photo.html_attr
});


export const getGenericPhoto = () => ({
    ref: CONSTS.CAFE_PHOTO_STANDIN,
    fromGoogle: false
});

function getCafeFromJson(candidate) {
    const photo = candidate.photos ? candidate.photos[0] : null;
    return fromJS({
        locked: true,
        placeId: candidate.place_id,
        name: candidate.name,
        formattedAddress: candidate.formatted_address,
        lat: candidate.lat,
        lng: candidate.lng,
        photos: [photo ? getGooglePhotoFromJson(photo) : getGenericPhoto()]
    })
};
  
function toggleCityLock(cityArr = List([]), lockedId=null) {
    if (lockedId === null) {
        return cityArr.map(res => res.delete('locked'));
    } else {
        return cityArr.map(city => {
            const cityId = city.get('id');
            return lockedId === cityId ?
            city.set('locked', true) :
            city.set('locked', false);
        })
    }
}

function toggleCafeLock(cafe = Map(), lockedId=null) {
    if (lockedId === null) {
        return cafe.delete('locked');
    } else {
        return lockedId === cafe.get('placeId') ?
        cafe.set('locked', true) :
        cafe.set('locked', false);
    }
}

function createCity(city) {
    const cityPhoto = city.photo_src;
    return Map({
        id: city.id,
        name: city.name,
        lat: city.lat,
        lng: city.lng,
        country: city.country,
        photos: [cityPhoto ? cityPhoto : CONSTS.CITY_PHOTO_STANDIN]
    })
}

function filterMessages(state, propName, ids) {
    return state.get(propName).filter((message) => !ids.includes(message.id));
}

export default (state = Map({}), action) => {
    switch (action.type) {
        case PRELOADED_CITIES_RETURNED:
            return state.set('preLoadedCities', fromJS(action.payload.cities));

        case CAFE_OPTION_SELECTED:
            return state.set('cafeQueryState', action.type);

        case HYDRATE_CAFE_OPTION:
            const cafe = getCafeFromJson(action.payload);
            return state.merge({
                "cafeQueryState": action.type,
                "cafeResponse": cafe,
                'cafeLock': cafe
            })

        case CAFE_OPTION_LOCKED:
            const CafeResponse = state.get('cafeResponse');
            const ToggledResponse = toggleCafeLock(CafeResponse, action.payload.placeId);
            return state.merge({
                'cafeLock': fromJS(action.payload),
                'cafeResponse': ToggledResponse
            });

        case PRELOADED_CITY_SELECTED:
            const cityOption = action.payload;
            let FilteredOptions = state.get('preLoadedCities').filter((city) => {
                return (city.get('country') === cityOption.country && city.get('name') === cityOption.name);
            });

            const lockByDefault = FilteredOptions.size === 1;
            if (lockByDefault) {
                const lockedCity = FilteredOptions.get(0).set('locked', true);
                FilteredOptions = FilteredOptions.set(0, lockedCity);
            }
            return state.merge({
                'cityResponse': FilteredOptions,
                'cityLock': lockByDefault ? FilteredOptions.get(0) : Map()
            });

        case CAFE_OPTION_UNLOCKED:
            return state.merge({
                'cafeLock': Map(),
                'cafeResponse': null 
            })

        case CLEAR_CAFE_MESSAGES:
            return state.set('cafeMessages', filterMessages(state.get('cafeMessages')));

        case GETTING_CITY_OPTIONS:
            return state.set('cityQueryState', action.type);

        case CITY_OPTIONS_RETURNED:
            return state.merge({
                'cityQueryState': action.type,
                'cityResponse': List([createCity(action.payload[0])])
            });

        case CITY_OPTION_LOCKED:
            let CityResponse = state.get('cityResponse');
            if (!CityResponse.size) {
                CityResponse = CityResponse.push(createCity(action.payload));
            }
            return state.merge({
                'cityLock': fromJS(action.payload),
                'cityResponse': toggleCityLock(CityResponse, action.payload.id)
            });

        case CITY_OPTION_UNLOCKED:
            return state.merge({
                'cityLock': Map(),
                'cityResponse': toggleCityLock(state.get('cityResponse'))
            });

        case CLEAR_CITY_MESSAGES:
            return filterMessages(state, 'cityMessages', action.payload);
        
        default:
            return state;
    }
};
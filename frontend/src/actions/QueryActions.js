import API from "../utilities/API";
import {
    GETTING_CAFE_OPTIONS,
    CAFE_OPTIONS_RETURNED,
    GETTING_CITY_OPTIONS,
    CITY_OPTIONS_RETURNED,
    PRELOADED_CITY_SELECTED,
    CAFE_OPTION_LOCKED,
    CAFE_OPTION_UNLOCKED,
    CITY_OPTION_LOCKED,
    CITY_OPTION_UNLOCKED,
    CLEAR_CAFE_MESSAGES,
    CLEAR_CITY_MESSAGES,
    GETTING_PRELOADED_CITIES,
    PRELOADED_CITIES_RETURNED
} from "../constants/ActionConstants";
import CONSTS from "../constants/Constants";

// ----------------------------------- API Actions ------------------------------------ //

export function getPreLoadedCitiesFunc(dispatch) {
    return () => {
        dispatch({
            type: GETTING_PRELOADED_CITIES
        })

        API.get(CONSTS.GET_CITIES)
        .then(res => {
            if (res.status === 200) {
                dispatch({
                    type: PRELOADED_CITIES_RETURNED,
                    payload: res.data
                });
            }
        })
    }
}

export function searchForCafeFunc(dispatch) {
    return (cafeQuery) => {
        dispatch({
            type: GETTING_CAFE_OPTIONS,
            payload: {
                query: cafeQuery
            }
        });

        API.get(CONSTS.SEARCH_CAFE + cafeQuery)
        .then(res => {
            if (res.status === 200) {
                dispatch({
                    type: CAFE_OPTIONS_RETURNED,
                    payload: res.data
                });
            }
        });
    }
}


export function searchForCityFunc(dispatch) {
    return (cityQuery, getAccessTokenWithPopup) => {
        dispatch({
            type: GETTING_CITY_OPTIONS,
            payload: {
                query: cityQuery
            }
        });

        getAccessTokenWithPopup({ audience: CONSTS.API_BASE + 'cities', scope: 'create:city' })
        .then(res => {
            return API.get(CONSTS.SEARCH_CITY + cityQuery, {
                headers: {
                    Authorization: 'Bearer ' + res //the token is a variable which holds the token
                }
            })
        }).then(res => {
            if (res.status === 200) {
                dispatch({
                    type: CITY_OPTIONS_RETURNED,
                    payload: res.data.cities
                });
            }
        });
    }
}


// ----------------------------------- Default Section ------------------------------------ //

export function selectPreLoadedCityFunc(dispatch) {
    return (data) => {
        dispatch({
            type: PRELOADED_CITY_SELECTED,
            payload: data
        })
    }
}

export function optionLockToggledFunc(dispatch) {
    return (isCafe, data) => {
        let unlock = data.locked === true
        if (unlock) {
            dispatch({
                type: isCafe ? CAFE_OPTION_UNLOCKED : CITY_OPTION_UNLOCKED,
                payload: data
            })
        } else {
            dispatch({
                type: isCafe ? CAFE_OPTION_LOCKED : CITY_OPTION_LOCKED,
                payload: data
            })
        }
    }
}


// ----------------------------------- Clearing Actions ------------------------------------ //

export function clearMessagesFunc() {
    return (isCafe, ids) => {
        return {
            type: isCafe ? CLEAR_CAFE_MESSAGES : CLEAR_CITY_MESSAGES,
            payload: ids
        }
    }
}
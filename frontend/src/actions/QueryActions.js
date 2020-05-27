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
    GETTING_CITY_DATA,
    CITY_DATA_RETURNED
} from "../constants/ActionConstants";
import CONSTS from "../constants/Constants";

const payload = [
    {
        placeId: 1,
        similarityRank: 1,
        name: "Chocolati Cafe",
        formattedAddress: "8319 Greenwood Ave N, Seattle, WA 98103",
        rating: 4.8,
        lat: 47.689747,
        lng: -122.355425,
        wordCloud: [
            {
                text: 'Hello',
                value: 26
            },
            {
                text: 'There',
                value: 15
            }
        ],
        photos: [
            "https://cdn.kqed.org/wp-content/uploads/sites/24/2012/02/chocolatifront.jpg"
        ]
    },
    {
        placeId: 3,
        similarityRank: 2,
        name: "Chocolati",
        formattedAddress: "7810 East Green Lake Dr N, Seattle, WA 98115",
        rating: 3.8,
        lat: 47.685441,
        lng: -122.336002,
        wordCloud: [
            {
                text: 'Hello',
                value: 26
            },
            {
                text: 'There',
                value: 15
            }
        ],
        photos: [
            "https://www.seattlegreenlaker.com/wp-content/uploads/2015/02/Chocolati1-300x199.jpg"
        ]
    },
    {
        placeId: 2,
        similarityRank: 3,
        name: "Chocolati Cafe Wallingford",
        formattedAddress: "1716 N 45th St, Seattle, WA 98103",
        rating: 4.5,
        lat: 47.661505,
        lng: -122.336813,
        wordCloud: [
            {
                text: 'Hello',
                value: 26
            },
            {
                text: 'There',
                value: 15
            }
        ],
        photos: [
            "https://s3-media0.fl.yelpcdn.com/bphoto/7sLuhmRJ_VLfAbvK7cZEuQ/348s.jpg"
        ]
    }
]

// ----------------------------------- API Actions ------------------------------------ //

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
    return (cityQuery) => {
        dispatch({
            type: GETTING_CITY_OPTIONS,
            payload: {
                query: cityQuery
            }
        });
    
        API.get(CONSTS.SEARCH_CITY + cityQuery)
        .then(res => {
            dispatch({
                type: CITY_OPTIONS_RETURNED,
                payload: res
            });
        });
    }
}

export function exploreCityFunc(dispatch) {
    return (cityId) => {
        dispatch({
            type: GETTING_CITY_DATA,
            payload: cityId
        })

        API.get(CONSTS.GET_CITIES + cityId + '/')
        .then(res => {
            if (res.status === 200) {
                dispatch({
                    type: CITY_DATA_RETURNED,
                    payload: res.data
                })
            }
        })
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
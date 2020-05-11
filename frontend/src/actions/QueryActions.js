import dispatcher from "../dispatcher";
import API from "../utilities/API";
import ACTION_CONSTS from "../constants/ActionConstants";
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

export function searchForCafe(cafeQuery) {
    dispatcher.dispatch({
        type: ACTION_CONSTS.GETTING_CAFE_OPTIONS,
        payload: {
            query: cafeQuery
        }
    });

    API.get(CONSTS.SEARCH_CAFE + cafeQuery)
    .then(res => {
        if (res.status === 200) {
            dispatcher.dispatch({
                type: ACTION_CONSTS.CAFE_OPTIONS_RETURNED,
                payload: res.data
            });
        }
    });

}


export function searchForCity(cityQuery) {
    dispatcher.dispatch({
        type: ACTION_CONSTS.GETTING_CITY_OPTIONS,
        payload: {
            query: cityQuery
        }
    });

    API.get(CONSTS.SEARCH_CITY + cityQuery)
    .then(res => {
        console.log("In city search option", res);
        dispatcher.dispatch({
            type: ACTION_CONSTS.CITY_OPTIONS_RETURNED,
            payload: res
        });
    });
}

export function findMostSimilarWithCurrentParams(city, cafe) {
    dispatcher.dispatch({
        type: ACTION_CONSTS.FINDING_MOST_SIMILAR
    })

    // setTimeout( () => {
    //     dispatcher.dispatch({
    //         type: ACTION_CONSTS.SIMILAR_CAFES_FOUND,
    //         payload: payload
    //     })
    // }, 2000)

    API.post(CONSTS.FIND_MOST_SIMILAR, {
        cityId: city.id,
        cafeId: cafe.placeId,
        cafeName: cafe.name,
        cafeAddr: cafe.formattedAddress
    }).then(res => {
        if (res.status === 200) {
            dispatcher.dispatch({
                type: ACTION_CONSTS.SIMILAR_CAFES_FOUND,
                payload: res.data
            });
        }
    });
}

export function loadCafeDetails(cafeId) {
    dispatcher.dispatch({
        type: ACTION_CONSTS.GETTING_CAFE_DETAILS,
        payload: cafeId
    })

    // setTimeout( () => {
    //     dispatcher.dispatch({
    //         type: ACTION_CONSTS.CAFE_DETAILS_RETURNED,
    //         payload: payload
    //     })
    // }, 2000)

    API.get(CONSTS.GET_CAFE_DETAILS + cafeId)
    .then(res => {
        if (res.status === 200) {
            dispatcher.dispatch({
                type: ACTION_CONSTS.CAFE_DETAILS_RETURNED,
                payload: res.data
            });
        }
    });
}


// ----------------------------------- Default Section ------------------------------------ //

export function toggleCafeOptionHover(cafeId, isHovered) {
    dispatcher.dispatch({
        type: isHovered ? ACTION_CONSTS.CAFE_HOVER : ACTION_CONSTS.CAFE_UNHOVER,
        payload: cafeId
    })
}

export function highlightCafeOnMap(cafeId) {
    dispatcher.dispatch({
        type: ACTION_CONSTS.HIGHLIGHT_CAFE,
        payload: cafeId
    })
}

export function selectPreLoadedCity(data) {
    dispatcher.dispatch({
        type: ACTION_CONSTS.PRELOADED_CITY_SELECTED,
        payload: data
    })
}

export function optionLockToggled(isCafe, data) {
    let unlock = data.locked === true
    if (unlock) {
        dispatcher.dispatch({
            type: isCafe ? ACTION_CONSTS.CAFE_OPTION_UNLOCKED : ACTION_CONSTS.CITY_OPTION_UNLOCKED,
            payload: data
        })
    } else {
        dispatcher.dispatch({
            type: isCafe ? ACTION_CONSTS.CAFE_OPTION_LOCKED : ACTION_CONSTS.CITY_OPTION_LOCKED,
            payload: data
        })
    }
}

export function tabSwitched(newTab) {
    dispatcher.dispatch({
        type: ACTION_CONSTS.TAB_SWITCHED,
        payload: {
            newTab: newTab
        }
    });
}


// ----------------------------------- Clearing Actions ------------------------------------ //

export function clearSearch() {
    dispatcher.dispatch({
        type: ACTION_CONSTS.CLEAR_SEARCH
    })
}

export function clearMessages(isCafe, ids) {
    dispatcher.dispatch({
        type: isCafe ? ACTION_CONSTS.CLEAR_CAFE_MESSAGES : ACTION_CONSTS.CLEAR_CITY_MESSAGES,
        payload: ids
    })
}
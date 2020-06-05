import API from "../utilities/API";
import CONSTS from '../constants/Constants'
import {
    TAB_SWITCHED,
    FINDING_MOST_SIMILAR,
    SIMILAR_CAFES_FOUND,
    CLEAR_SEARCH,
    GETTING_CITY_DATA,
    CITY_DATA_RETURNED
} from '../constants/ActionConstants'

export function findMostSimilarFunc(dispatch) {
    return (queryString) => {
        dispatch({
            type: FINDING_MOST_SIMILAR
        })

        API.get(CONSTS.FIND_MOST_SIMILAR + queryString).then(res => {
            if (res.status === 200) {
                dispatch({
                    type: SIMILAR_CAFES_FOUND,
                    payload: res.data
                });
            }
        });
    }
}

export function exploreCityFunc(dispatch) {
    return (queryString, cityId) => {
        dispatch({
            type: GETTING_CITY_DATA,
            payload: cityId
        })

        API.get(CONSTS.EXPLORE_CITY + queryString)
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

export function tabSwitchedFunc(dispatch) {
    return () => {
        dispatch({
            type: TAB_SWITCHED,
        })
    }
}

export function clearSearchFunc(dispatch) {
    return () => {
        dispatch({
            type: CLEAR_SEARCH
        })
    }
}

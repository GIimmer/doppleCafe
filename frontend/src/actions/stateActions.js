import API from "../utilities/API";
import CONSTS from '../constants/Constants'
import {
    TAB_SWITCHED,
    FINDING_MOST_SIMILAR,
    SIMILAR_CAFES_FOUND,
    CLEAR_SEARCH
} from '../constants/ActionConstants'


export function tabSwitchedFunc(dispatch) {
    return (newTab) => {
        dispatch({
            type: TAB_SWITCHED,
            payload: {
                newTab: newTab
            }
        })
    }
}

export function findMostSimilarFunc(dispatch) {
    return (city, cafe) => {
        dispatch({
            type: FINDING_MOST_SIMILAR
        })

        API.post(CONSTS.FIND_MOST_SIMILAR, {
            cityId: city.id,
            cafeId: cafe.placeId,
            cafeName: cafe.name,
            cafeAddr: cafe.formattedAddress
        }).then(res => {
            if (res.status === 200) {
                dispatch({
                    type: SIMILAR_CAFES_FOUND,
                    payload: res.data
                });
            }
        });
    }
}


export function clearSearchFunc(dispatch) {
    return () => {
        dispatch({
            type: CLEAR_SEARCH
        })
    }
}

import API from "../utilities/API";
import CONSTS from "../constants/Constants";
import {
    GETTING_CAFE_DETAILS,
    CAFE_DETAILS_RETURNED,
    WORD_BAG_REF_RETURNED,
    CAFE_HOVER,
    CAFE_UNHOVER,
    HIGHLIGHT_CAFE
} from '../constants/ActionConstants'


export function getWordBagRefFunc(dispatch) {
    return () => {
        API.get(CONSTS.GET_WORD_BAG_REF)
        .then(res => {
            if (res.status === 200) {
                dispatch({
                    type: WORD_BAG_REF_RETURNED,
                    payload: res.data
                });
            }
        });
    }
}

export function loadCafeDetailsFunc(dispatch) {
    return (cafeId) => {
        dispatch({
            type: GETTING_CAFE_DETAILS,
            payload: cafeId
        })

        API.get(CONSTS.GET_CAFE_DETAILS + cafeId)
        .then(res => {
            if (res.status === 200) {
                dispatch({
                    type:CAFE_DETAILS_RETURNED,
                    payload: res.data
                });
            }
        });
    }
}

export function setViewingDetailsFunc(dispatch) {
    return (cafe) => {
        dispatch({
            type:CAFE_DETAILS_RETURNED,
            payload: cafe
        })
    }
}

export function toggleCafeHoverFunc(dispatch) {
    return (cafeId, isHovered) => {
        dispatch({
            type: isHovered ? CAFE_HOVER : CAFE_UNHOVER,
            payload: cafeId
        })
    }
}

export function highlightCafeOnMapFunc(dispatch) {
    return (cafeId) => {
        dispatch({
            type: HIGHLIGHT_CAFE,
            payload: cafeId
        })
    }
}
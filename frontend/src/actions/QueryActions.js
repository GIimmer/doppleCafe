import dispatcher from "../dispatcher";
import axios from "axios";
import ACTION_CONSTS from "../constants/ActionConstants";
import CONSTS from "../constants/Constants";

export function searchForCafe(cafeQuery) {
    dispatcher.dispatch({
        type: ACTION_CONSTS.GETTING_CAFE_OPTIONS,
        payload: {
            query: cafeQuery
        }
    });

    axios.get(ACTION_CONSTS.URL_BASE + ACTION_CONSTS.SEARCH_CAFE + cafeQuery)
    .then(res => {
        console.log("In cafe search option", res);
        dispatcher.dispatch({
            type: ACTION_CONSTS.CAFE_OPTIONS_RETURNED,
            payload: res
        });
    });

}


export function searchForCity(cityQuery) {
    dispatcher.dispatch({
        type: ACTION_CONSTS.GETTING_CITY_OPTIONS,
        payload: {
            query: cityQuery
        }
    });

    axios.get(CONSTS.URL_BASE + CONSTS.SEARCH_CITY + cityQuery)
    .then(res => {
        console.log("In city search option", res);
        dispatcher.dispatch({
            type: ACTION_CONSTS.CITY_OPTIONS_RETURNED,
            payload: res
        });
    });
}

export function findMostSimilarWithCurrentParams() {
    dispatcher.dispatch({
        type: ACTION_CONSTS.FIND_MOST_SIMILAR
    })
}

export function clearSearch() {
    dispatcher.dispatch({
        type: ACTION_CONSTS.CLEAR_SEARCH
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

export function clearMessages(isCafe, ids) {
    dispatcher.dispatch({
        type: isCafe ? ACTION_CONSTS.CLEAR_CAFE_MESSAGES : ACTION_CONSTS.CLEAR_CITY_MESSAGES,
        payload: ids
    })
}

export function tabSwitched(newTab) {
    dispatcher.dispatch({
        type: ACTION_CONSTS.TAB_SWITCHED,
        payload: {
            newTab: newTab
        }
    });
}
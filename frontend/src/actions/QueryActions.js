import dispatcher from "../dispatcher";
import axios from "axios";
import ACTION_CONSTS from "../constants/ActionConstants";
import CONSTS from "../constants/Constants";

export function searchForCafe(cafeQuery) {
    dispatcher.dispatch({
        type: ACTION_CONSTS.GETTING_CAFE_OPTIONS,
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

export function tabSwitched(newTab) {
    dispatcher.dispatch({
        type: ACTION_CONSTS.TAB_SWITCHED,
        payload: {
            newTab: newTab
        }
    });
}
import { EventEmitter } from "events";

import dispatcher from "../dispatcher";
import ACTION_CONSTS from "../constants/ActionConstants";
import CONSTS from "../constants/Constants";

class QueryStore extends EventEmitter {
    constructor() {
        super()
        this.state = {
            userCanLoadNewCity: true,
            currentTab: CONSTS.QUERY_VIEW,
            lastCafeQuery: "Chocolati",
            lastCityQuery: "Hanoi",
            cafeResponse: [
                {
                    name: "Chocolati Cafe",
                    formattedAddress: "8319 Greenwood Ave N, Seattle, WA 98103",
                    photoURL: "https://cdn.kqed.org/wp-content/uploads/sites/24/2012/02/chocolatifront.jpg"
                },
                {
                    name: "The Dray",
                    formattedAddress: "708 NW 65th St, Seattle, WA 98117",
                    photoURL: "https://media2.fdncms.com/stranger/imager/u/original/23946105/hh_thedray_faustomatic.jpg"
                }
            ],
            cityResponse: {
                name: "Hanoi",
                Latitude: 0,
                Longitude: 0
            }
        }
    }

    createCafe(cafe) {
        this.state.cafeResponse.push({
            name: cafe.name,
            formattedAddress: cafe.addr,
            photoURL: cafe.photoURL
        });
    }

    switchTabs(tabId) {
        this.state.currentTab = (tabId === 0) ? CONSTS.QUERY_VIEW : CONSTS.EXPLORE_VIEW;
    }

    getAll() {
        return this.state;
    }

    handleActions(action) { 
        console.log("QueryStore recieved an action: ", action);
        switch (action.type) {
            case ACTION_CONSTS.CAFE_OPTIONS_RETURNED:
                this.createCafe(action.cafe);
                break;

            case ACTION_CONSTS.CITY_OPTIONS_RETURNED:
                this.createCity(action.city);
                break;

            case ACTION_CONSTS.PERMISSION_UPDATED:
                this.state.userCanLoadNewCity = action.userCanLoadCities > 0;
                break;

            case ACTION_CONSTS.TAB_SWITCHED:
                this.state.currentTab = action.payload.newTab;
                break;
        
            default:
                console.error("handle actions issue in query store", action);
                break;
        }
        this.emit("change");
    }
}

const queryStore = new QueryStore();
dispatcher.register(queryStore.handleActions.bind(queryStore));

export default queryStore;
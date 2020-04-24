import { EventEmitter } from "events";

import dispatcher from "../dispatcher";
import ACTION_CONSTS from "../constants/ActionConstants";
import CONSTS from "../constants/Constants";

class QueryStore extends EventEmitter {
    cafeFilter = ({ lastCafeQuery, cafeMessages, cafeResponse }) => ({ lastCafeQuery, cafeMessages, cafeResponse });
    cityFilter = ({ userCanLoadNewCity, lastCityQuery, possibleCities, cityMessages, cityResponse }) =>
        ({ userCanLoadNewCity, lastCityQuery, possibleCities, cityMessages, cityResponse })

    constructor() {
        super()
        this.state = {
            userCanLoadNewCity: true,
            currentTab: CONSTS.QUERY_VIEW,
            lastCafeQuery: "Chocolati",
            lastCityQuery: "Hanoi, Vietnam",
            possibleCities: [
                {
                    name: "Seattle",
                    country: "US",
                    latitude: "47.6062",
                    longitude: "-122.3321"
                },
                {
                    name: "Hanoi",
                    country: "VN",
                    latitude: "21.0278",
                    longitude: "105.8342"
                },
                {
                    name: "Portland",
                    country: "US",
                    latitude: "45.5051",
                    longitude: "-122.6750"
                }
            ],
            cafeMessages: [
                {
                    type: 'info',
                    text: 'this is a message'
                },
                {
                    type: 'warning',
                    text: 'this is a warning'
                }
            ],
            cityMessages: [
                {
                    type: 'info',
                    text: 'this is a message'
                },
                {
                    type: 'warning',
                    text: 'this is a warning'
                }
            ],
            cityResponse: {
                name: "Seattle",
                country: "US",
                latitude: "47.6062",
                longitude: "-122.3321",
                photos: [
                    "https://cdn.pixabay.com/photo/2015/03/26/22/09/city-skyline-693502_960_720.jpg"
                ]
            },
            cafeResponse: {
                name: "Chocolati",
                formattedAddr: "8319 Greenwood Ave N, Seattle, WA 98103",
                compoundCode: "",
                photos: [
                    "https://cdn.kqed.org/wp-content/uploads/sites/24/2012/02/chocolatifront.jpg"
                ]
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

    createCity(city) {
        this.state.cityResponse = {
            name: city.name,
            latitude: city.latitude,
            longitude: city.longitude,
            country: city.country
        }
    }

    switchTabs(tabId) {
        this.state.currentTab = (tabId === 0) ? CONSTS.QUERY_VIEW : CONSTS.EXPLORE_VIEW;
    }

    getData(filterFor=null) {
        switch (filterFor) {
            case 'cafe':
                return this.cafeFilter(this.state)
        
            case 'city':
                return this.cityFilter(this.state)

            default:
                return this.state;
        }
    }

    handleActions(action) { 
        console.log("QueryStore recieved an action: ", action);
        switch (action.type) {
            case ACTION_CONSTS.GETTING_CAFE_OPTIONS:
                this.state.lastCafeQuery = action.payload.query;
                this.emit("cafeUpdate");
                break;

            case ACTION_CONSTS.CAFE_OPTIONS_RETURNED:
                this.createCafe(action.payload);
                this.emit("cafeUpdate");
                break;

            case ACTION_CONSTS.GETTING_CITY_OPTIONS:
                this.state.lastCafeQuery = action.payload.query;
                this.emit("cityUpdate");
                break; 

            case ACTION_CONSTS.CITY_OPTIONS_RETURNED:
                this.createCity(action.city);
                this.emit("cityUpdate");
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
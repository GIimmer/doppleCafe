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
            searchParamsSet: false,
            possibleCities: [
                {
                    id: 1,
                    name: "Seattle",
                    country: "US",
                    latitude: "47.6062",
                    longitude: "-122.3321",
                    photos: [
                        "https://cdn.pixabay.com/photo/2015/03/26/22/09/city-skyline-693502_960_720.jpg"
                    ]
                },
                {
                    id: 2,
                    name: "Hanoi",
                    country: "VN",
                    latitude: "21.0278",
                    longitude: "105.8342"
                },
                {
                    id: 3,
                    name: "Portland",
                    country: "US",
                    latitude: "45.5051",
                    longitude: "-122.6750"
                }
            ],
            cafeMessages: [
                {
                    id: 4,
                    type: 'info',
                    text: 'this is a message',
                    visible: true
                },
                {
                    id: 5,
                    type: 'warning',
                    text: 'this is a warning',
                    visible: true
                }
            ],
            cityMessages: [
                {
                    id: 6,
                    type: 'info',
                    text: 'this is a message',
                    visible: true
                },
                {
                    id: 7,
                    type: 'warning',
                    text: 'this is a warning',
                    visible: true
                }
            ],
            cityResponse: [{
                id: 1,
                name: "Seattle",
                country: "US",
                latitude: "47.6062",
                longitude: "-122.3321",
                photos: [
                    "https://cdn.pixabay.com/photo/2015/03/26/22/09/city-skyline-693502_960_720.jpg"
                ]
            }],
            cityLock: {},
            cafeResponse: [
                {
                    id: 1,
                    name: "Chocolati Cafe",
                    formattedAddr: "8319 Greenwood Ave N, Seattle, WA 98103",
                    compoundCode: "MJQV+VQ Seattle, Washington",
                    latitude: "47.689747",
                    longitude: "-122.355425",
                    photos: [
                        "https://cdn.kqed.org/wp-content/uploads/sites/24/2012/02/chocolatifront.jpg"
                    ]
                },
                {
                    id: 2,
                    name: "Chocolati Cafe Wallingford",
                    formattedAddr: "1716 N 45th St, Seattle, WA 98103",
                    compoundCode: "MM67+J7 Seattle, Washington",
                    latitude: "47.661505",
                    longitude: "-122.336813",
                    photos: [
                        "https://s3-media0.fl.yelpcdn.com/bphoto/7sLuhmRJ_VLfAbvK7cZEuQ/348s.jpg"
                    ]
                },
                {
                    id: 3,
                    name: "Chocolati",
                    formattedAddr: "7810 East Green Lake Dr N, Seattle, WA 98115",
                    compoundCode: "MMP7+5J Seattle, Washington",
                    latitude: "47.685441",
                    longitude: "-122.336002",
                    photos: [
                        "https://www.seattlegreenlaker.com/wp-content/uploads/2015/02/Chocolati1-300x199.jpg"
                    ]
                }
            ],
            cafeLock: {}
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

    filterMessages(propName, ids) {
        this.state[propName] = this.state[propName].filter((message) => !ids.includes(message.id));
    }

    switchTabs(tabId) {
        this.state.currentTab = (tabId === 0) ? CONSTS.QUERY_VIEW : CONSTS.EXPLORE_VIEW;
    }

    toggleLockState(objectArr, lockedId=null) {
        if (lockedId === null) {
            this.state.searchParamsLocked = false;
            objectArr.forEach(res => { delete res.locked})
        } else {
            objectArr.forEach((object) => {
                if (object.id === lockedId) {
                    object['locked'] = true;
                } else {
                    object['locked'] = false;
                }
            })
        }
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

            case ACTION_CONSTS.CAFE_OPTION_LOCKED:
                this.state.cafeLock = action.payload;
                this.toggleLockState(this.state.cafeResponse, action.payload.id);
                this.emit("cafeUpdate");
                break;
            
            case ACTION_CONSTS.CAFE_OPTION_UNLOCKED:
                this.state.cafeLock = {};
                this.toggleLockState(this.state.cafeResponse);
                this.emit("cafeUpdate");
                break;
            
            case ACTION_CONSTS.CLEAR_CAFE_MESSAGES:
                this.filterMessages('cafeMessages', action.payload);
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

            case ACTION_CONSTS.CITY_OPTION_LOCKED:
                this.state.cityLock = action.payload;
                this.toggleLockState(this.state.cityResponse, action.payload.id);
                this.emit("cityUpdate");
                break;

            case ACTION_CONSTS.CITY_OPTION_UNLOCKED:
                this.state.cityLock = {};
                this.toggleLockState(this.state.cityResponse);
                this.emit("cityUpdate");
                break;

            case ACTION_CONSTS.CLEAR_CITY_MESSAGES:
                this.filterMessages('cityMessages', action.payload);
                this.emit("cityUpdate");
                break;
            
            case ACTION_CONSTS.FIND_MOST_SIMILAR:
                this.state.searchParamsSet = true;
                break;

            case ACTION_CONSTS.CLEAR_SEARCH:
                this.state.cityLock = {}; this.state.cafeLock = {};
                this.toggleLockState(this.state.cafeResponse); this.toggleLockState(this.state.cityResponse);
                this.state.searchParamsSet = false;
                this.emit("cityUpdate", "cafeUpdate");
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
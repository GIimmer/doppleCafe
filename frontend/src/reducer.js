import outcome from './reducers/outcomeReducer'
import query from './reducers/queryReducer'
import state from './reducers/stateReducer'
import reduceReducers from 'reduce-reducers'
import Immutable from 'immutable'
import CONSTS from "./constants/Constants"

export const InitialState = Immutable.fromJS({
    userCanLoadNewCity: true,
    currentTab: CONSTS.EXPLORE_VIEW,
    cafeQueryState: null,
    cityQueryState: null,
    searchParamsSet: false,
    cafesReturned: false,
    highlightedCafe: null,
    wordBagRef: null,
    preLoadedCities: [
        {
            id: 1,
            name: "Seattle",
            country: "US",
            lat: "47.6062",
            lng: "-122.3321",
            photo: {
                src: "https://cdn.pixabay.com/photo/2015/03/26/22/09/city-skyline-693502_960_720.jpg"
            }
        },
        {
            id: 2,
            name: "Hanoi",
            country: "VN",
            lat: "21.0278",
            lng: "105.8342",
            photo: {
                src: "https://images.pexels.com/photos/1845955/pexels-photo-1845955.jpeg?cs=srgb&dl=vietnamese-hanoi-1845955.jpg&fm=jpg"
            }
        },
        {
            id: 3,
            name: "Portland",
            country: "US",
            lat: "45.5051",
            lng: "-122.6750",
            photo: {
                src: "https://upload.wikimedia.org/wikipedia/commons/0/02/Portland%2C_Oreg%C3%B3n.jpg"
            }
        },
        {
            id: 4,
            name: "Portland",
            country: "US",
            lat: "43.6591",
            lng: "-70.2568"
        }
    ],
    cafeMessages: [],
    cityMessages: [],
    cityResponse: [],
    cityLock: {},
    cafeResponse: [],
    cafeLock: {},
    cafeDetails: {},
    returnedCafes: [],
    idToCafeMapper: {}
})

export default reduceReducers(
    InitialState,
    outcome,
    query,
    state
);
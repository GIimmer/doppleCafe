import { EventEmitter } from "events"

import dispatcher from "../dispatcher"
import ACTION_CONSTS from "../constants/ActionConstants"
import CONSTS from "../constants/Constants"
import { snakeToCamel } from '../utilities/utilities'

class QueryStore extends EventEmitter {
    cafeFilter = ({ cafeQueryState, cafeMessages, cafeResponse }) =>
        ({ cafeQueryState, cafeMessages, cafeResponse });

    cityFilter = ({ userCanLoadNewCity, cityQueryState, preLoadedCities, cityMessages, cityResponse }) =>
        ({ userCanLoadNewCity, cityQueryState, preLoadedCities, cityMessages, cityResponse });

    outcomeFilter = ({ cityLock, cafeLock, similarCafes, similarCafesFound, cafeDetails, highlightedCafe, wordBagRef }) => 
        ({ cityLock, cafeLock, similarCafes, similarCafesFound, cafeDetails, highlightedCafe, wordBagRef });

    constructor() {
        super()
        this.state = {
            userCanLoadNewCity: true,
            currentTab: CONSTS.QUERY_VIEW,
            cafeQueryState: null,
            cityQueryState: null,
            searchParamsSet: false,
            similarCafesFound: false,
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
            cafeMessages: [
                // {
                //     id: 4,
                //     type: 'info',
                //     text: 'this is a message',
                //     visible: true
                // },
                // {
                //     id: 5,
                //     type: 'warning',
                //     text: 'this is a warning',
                //     visible: true
                // }
            ],
            cityMessages: [
                // {
                //     id: 6,
                //     type: 'info',
                //     text: 'this is a message',
                //     visible: true
                // },
                // {
                //     id: 7,
                //     type: 'warning',
                //     text: 'this is a warning',
                //     visible: true
                // }
            ],
            cityResponse: [
            // {
            //     id: 1,
            //     name: "Seattle",
            //     country: "US",
            //     latitude: "47.6062",
            //     longitude: "-122.3321",
            //     photos: [
            //         "https://cdn.pixabay.com/photo/2015/03/26/22/09/city-skyline-693502_960_720.jpg"
            //     ]
            // }
            ],
            cityLock: {
                // id: 1,
                // name: "Seattle",
                // country: "US",
                // latitude: 47.6062,
                // longitude: -122.3321,
                // photos: [
                //     "https://cdn.pixabay.com/photo/2015/03/26/22/09/city-skyline-693502_960_720.jpg"
                // ]
            },
            cafeResponse: [
                // {
                //     id: 1,
                //     name: "Chocolati Cafe",
                //     formattedAddress: "8319 Greenwood Ave N, Seattle, WA 98103",
                //     compoundCode: "MJQV+VQ Seattle, Washington",
                //     latitude: "47.689747",
                //     longitude: "-122.355425",
                //     photos: [
                //         "https://cdn.kqed.org/wp-content/uploads/sites/24/2012/02/chocolatifront.jpg"
                //     ]
                // },
                // {
                //     id: 2,
                //     name: "Chocolati Cafe Wallingford",
                //     formattedAddress: "1716 N 45th St, Seattle, WA 98103",
                //     compoundCode: "MM67+J7 Seattle, Washington",
                //     latitude: "47.661505",
                //     longitude: "-122.336813",
                //     photos: [
                //         "https://s3-media0.fl.yelpcdn.com/bphoto/7sLuhmRJ_VLfAbvK7cZEuQ/348s.jpg"
                //     ]
                // },
                // {
                //     id: 3,
                //     name: "Chocolati",
                //     formattedAddress: "7810 East Green Lake Dr N, Seattle, WA 98115",
                //     compoundCode: "MMP7+5J Seattle, Washington",
                //     latitude: "47.685441",
                //     longitude: "-122.336002",
                //     photos: [
                //         "https://www.seattlegreenlaker.com/wp-content/uploads/2015/02/Chocolati1-300x199.jpg"
                //     ]
                // }
            ],
            cafeLock: {
                // id: 1,
                // name: "Chocolati Cafe",
                // formattedAddress: "8319 Greenwood Ave N, Seattle, WA 98103",
                // compoundCode: "MJQV+VQ Seattle, Washington",
                // latitude: 47.689747,
                // longitude: -122.355425,
                // photos: [
                //     "https://cdn.kqed.org/wp-content/uploads/sites/24/2012/02/chocolatifront.jpg"
                // ]
            },
            cafeDetails: {},
            similarCafes: [
                // {
                //     id: 1,
                //     similarityRank: 1,
                //     name: "Chocolati Cafe",
                //     formattedAddress: "8319 Greenwood Ave N, Seattle, WA 98103",
                //     rating: 4.8,
                //     latitude: 47.689747,
                //     longitude: -122.355425,
                //     wordCloud: [
                //         {
                //             text: 'Hello',
                //             value: 26
                //         },
                //         {
                //             text: 'There',
                //             value: 15
                //         }
                //     ],
                //     photos: [
                //         "https://cdn.kqed.org/wp-content/uploads/sites/24/2012/02/chocolatifront.jpg"
                //     ]
                // },
                // {
                //     id: 3,
                //     similarityRank: 2,
                //     name: "Chocolati",
                //     formattedAddress: "7810 East Green Lake Dr N, Seattle, WA 98115",
                //     rating: 3.8,
                //     latitude: 47.685441,
                //     longitude: -122.336002,
                //     wordCloud: [
                //         {
                //             text: 'Hello',
                //             value: 26
                //         },
                //         {
                //             text: 'There',
                //             value: 15
                //         }
                //     ],
                //     photos: [
                //         "https://www.seattlegreenlaker.com/wp-content/uploads/2015/02/Chocolati1-300x199.jpg"
                //     ]
                // },
                // {
                //     id: 2,
                //     similarityRank: 3,
                //     name: "Chocolati Cafe Wallingford",
                //     formattedAddress: "1716 N 45th St, Seattle, WA 98103",
                //     rating: 4.5,
                //     latitude: 47.661505,
                //     longitude: -122.336813,
                //     wordCloud: [
                //         {
                //             text: 'Hello',
                //             value: 26
                //         },
                //         {
                //             text: 'There',
                //             value: 15
                //         }
                //     ],
                //     photos: [
                //         "https://s3-media0.fl.yelpcdn.com/bphoto/7sLuhmRJ_VLfAbvK7cZEuQ/348s.jpg"
                //     ]
                // }
            ]
        }
    }

    createSimilarCafes(cafeCandidates) {
        this.state.similarCafes = cafeCandidates.map((cafe, idx) => {
            let jsObj = {
                similarityRank: idx + 1
            }

            Object.keys(cafe).forEach(key => jsObj[snakeToCamel(key)] = cafe[key]);
            
            return jsObj;
        })
    }

    createCafes(cafeCandidates) {
        cafeCandidates.forEach((cafe) => {
            let location = cafe.geometry.location,
                photo = cafe.photos ? cafe.photos[0] : null;
            this.state.cafeResponse.push({
                placeId: cafe.place_id,
                name: cafe.name,
                lat: location.lat,
                lng: location.lng,
                photo: photo ? {
                    fromGoogle: true,
                    height: photo.height,
                    width: photo.width,
                    ref: photo.photo_reference,
                    attr: photo.html_attributions[0]
                } : { ref: "https://cdn.pixabay.com/photo/2017/05/11/08/17/coffee-2303271_960_720.jpg", fromGoogle: false }
            });
        }) 
    }

    prepareDetailsPhotos(photos) {
        return photos.map((photo) => {
            return {
                fromGoogle: true,
                height: photo.height,
                width: photo.width,
                ref: photo.photo_ref,
                attr: photo.html_attr
            }
        })
    }

    imbueCafeDetails(cafe, newDetails) {
        for (let key of Object.keys(newDetails)) {
            let newKey = snakeToCamel(key);
            cafe[newKey] = newDetails[key];
        }
    }

    createCity(city) {
        this.state.cityResponse.push(
            {
                id: city.placeId,
                name: city.name,
                lat: city.latitude,
                lng: city.longitude,
                country: city.country
            }
        )
    }

    filterMessages(propName, ids) {
        this.state[propName] = this.state[propName].filter((message) => !ids.includes(message.id));
    }

    toggleLockState(objectArr, lockedId=null, forCafes=false) {
        if (lockedId === null) {
            this.state.searchParamsLocked = false;
            objectArr.forEach(res => { delete res.locked})
        } else {
            objectArr.forEach((object) => {
                let objectId = forCafes ? object.placeId : object.id;
                if (objectId === lockedId) {
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
                return this.cafeFilter(this.state);
        
            case 'city':
                return this.cityFilter(this.state);

            case 'outcomeFilter':
                return this.outcomeFilter(this.state);

            default:
                return this.state;
        }
    }

    clearData(params=null) {
        this.state.searchParamsSet = this.state.similarCafesFound = false;
        this.state.cityResponse = []; this.state.cafeResponse = [];
        this.state.cityLock = {}; this.state.cafeLock = {};
    }

    handleActions(action) { 
        console.log("QueryStore recieved an action: ", action);
        switch (action.type) {
            case ACTION_CONSTS.GETTING_CAFE_OPTIONS:
                this.state.cafeQueryState = action.type;
                this.emit("cafeUpdate");
                break;

            case ACTION_CONSTS.CAFE_OPTIONS_RETURNED:
                this.state.cafeQueryState = action.type;
                this.state.cafeResponse = [];
                this.createCafes(action.payload.candidates);
                this.emit("cafeUpdate");
                break;

            case ACTION_CONSTS.CAFE_OPTION_LOCKED:
                this.state.cafeLock = action.payload;
                this.toggleLockState(this.state.cafeResponse, action.payload.placeId, true);
                this.emit("cafeUpdate");
                break;

            case ACTION_CONSTS.PRELOADED_CITY_SELECTED:
                let cityOption = action.payload;
                this.state.cityResponse = this.state.preLoadedCities.filter((city) => {
                    return (city.country === cityOption.country && city.name === cityOption.name);
                });
                this.emit('cityUpdate');
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
                this.state.cityQueryState = action.type;
                this.emit("cityUpdate");
                break; 

            case ACTION_CONSTS.CITY_OPTIONS_RETURNED:
                this.state.cityQueryState = action.type;
                this.state.cityResponse = [];
                this.createCity(action.city);
                this.emit("cityUpdate");
                break;

            case ACTION_CONSTS.CITY_OPTION_LOCKED:
                this.state.cityLock = action.payload;
                if (!this.state.cityResponse.length) {
                    this.state.cityResponse.push(action.payload);
                }
                this.toggleLockState(this.state.cityResponse, action.payload.id);
                this.emit("cityUpdate");
                break;

            case ACTION_CONSTS.CITY_OPTION_UNLOCKED:
                this.state.cityLock = {};
                this.toggleLockState(this.state.cityResponse);
                this.emit("cityUpdate");
                break;

            case ACTION_CONSTS.GETTING_CAFE_DETAILS:
                this.state.cafeDetails.cafeId = action.payload;
                this.state.cafeDetails.state = action.type;
                this.emit("detailsUpdate");
                break;

            case ACTION_CONSTS.CAFE_DETAILS_RETURNED:
                let cafeInQuestion = this.state.cafeDetails[this.state.cafeDetails.cafeId];
                this.imbueCafeDetails(cafeInQuestion, action.payload);
                cafeInQuestion.photos = this.prepareDetailsPhotos(cafeInQuestion.photos);
                this.state.cafeDetails.state = action.type;
                this.emit("detailsUpdate");
                break;

            case ACTION_CONSTS.CAFE_HOVER:
                let cafeId = action.payload;
                if (this.state.cafeDetails.cafeId !== cafeId) {
                    this.state.cafeDetails.state = ACTION_CONSTS.CAFE_HOVER;
                    this.state.cafeDetails[cafeId] = this.state.similarCafes.find((cafe) => cafe.placeId === cafeId);
                    this.state.cafeDetails.cafeId = cafeId;
                    this.emit('detailsUpdate');
                }
                break;
             
            case ACTION_CONSTS.CAFE_UNHOVER:
                if (this.state.cafeDetails.state !== ACTION_CONSTS.CAFE_DETAILS_RETURNED) {
                    this.state.cafeDetails.state = this.state.cafeDetails.cafeId = null;
                    this.emit('detailsUpdate');
                }
                break;

            case ACTION_CONSTS.HIGHLIGHT_CAFE:
                this.state.highlightedCafe = action.payload;
                this.emit('detailsUpdate');
                break;

            case ACTION_CONSTS.CLEAR_CITY_MESSAGES:
                this.filterMessages('cityMessages', action.payload);
                this.emit("cityUpdate");
                break;
            
            case ACTION_CONSTS.FINDING_MOST_SIMILAR:
                this.state.searchParamsSet = true;
                break;

            case ACTION_CONSTS.SIMILAR_CAFES_FOUND:
                this.createSimilarCafes(action.payload.cafe_list);
                this.state.wordBagRef = action.payload.word_bag_ref;
                this.state.similarCafesFound = true;
                this.emit('detailsUpdate');
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
                this.clearData();
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
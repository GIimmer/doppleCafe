import React, { PureComponent } from 'react'
import { GoogleApiWrapper, Map, InfoWindow, Marker } from 'google-maps-react'
import QueryStore from "../../stores/QueryStore"
import { CONSTS } from "../../constants/Constants"

const GROUPCOLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

export class CafeMap extends PureComponent {
    constructor() {
        super();
        this.state = {
            highlightedCafeId: null,
            queryState: QueryStore.getData('outcomeFilter')
        }
        console.log(this.state.queryState);
    }

    componentDidMount() {
        QueryStore.on("detailsUpdate", () => {
            let queryState = QueryStore.getData('outcomeFilter'),
                highlightedCafeId = queryState.highlightedCafe;

            if (!this.state.highlightedCafeId && highlightedCafeId) {
                window.scrollTo(0,0);
            }

            this.setState({
                queryState: queryState,
                highlightCafeId: highlightedCafeId
            })
        })
    }

    onMarkerClick(marker) {
        let place_id = marker.id;
        console.log('in marker click: ', place_id);
    }

    onInfoWindowClose() {
        console.log('info window closed');
    }

    render() {
        return (
            // <div></div>
            <Map
            google={this.props.google}
            initialCenter={{
                lat: this.state.queryState.cityLock.lat,
                lng: this.state.queryState.cityLock.lng
            }}
            zoom={11}>
                {
                    this.state.queryState.similarCafes.map((cafe) => {
                        let markerColor = cafe.id === this.state.highlightCafeId ? 
                            'yellow' :
                                cafe.group !== undefined ? 
                                GROUPCOLORS[cafe.group] :
                                '';
                        return <Marker 
                            onClick={this.onMarkerClick}
                            key={cafe.placeId}
                            placeId={cafe.placeId}
                            name={cafe.name} 
                            title={cafe.name}
                            position={{ lat: cafe.lat, lng: cafe.lng }}
                            icon={{
                                url: require(`../../images/${markerColor}CafeIcon.png`),
                            }}
                        />
                    })
                }
        
                <InfoWindow onClose={this.onInfoWindowClose}>
                    <div>
                        <h1>{this.state.queryState.cityLock.name}</h1>
                    </div>
                </InfoWindow>
            </Map>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: (CONSTS.MAPS_EMBED_KEY)
})(CafeMap)
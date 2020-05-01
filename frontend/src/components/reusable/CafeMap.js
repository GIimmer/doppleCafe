import React, { PureComponent } from 'react'
import { GoogleApiWrapper, Map, InfoWindow, Marker } from 'google-maps-react'
import QueryStore from "../../stores/QueryStore"
import { CONSTS } from "../../constants/Constants"

const GROUPCOLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

export class CafeMap extends PureComponent {
    constructor() {
        super();
        this.state = {
            viewingCafeId: null,
            queryState: QueryStore.getData('outcomeFilter')
        }
        console.log(this.state.queryState);
    }

    componentDidMount() {
        QueryStore.on("change", () => {
            this.setState({
                queryState: QueryStore.getData()
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
        console.log('in render for map: ', this.state.queryState.cityLock)
        return (
            <div></div>
            // <Map
            // google={this.props.google}
            // initialCenter={{
            //     lat: this.state.queryState.cityLock.latitude,
            //     lng: this.state.queryState.cityLock.longitude
            // }}
            // zoom={11}>
            //     {
            //         this.state.queryState.similarCafes.map((cafe) => {
            //             return <Marker 
            //                 onClick={this.onMarkerClick}
            //                 key={cafe.id}
            //                 id={cafe.id}
            //                 name={cafe.name} 
            //                 title={cafe.name}
            //                 position={{ lat: cafe.latitude, lng: cafe.longitude }}
            //                 icon={{
            //                     url: require(`../../images/${cafe.group === undefined ? '' : GROUPCOLORS[cafe.group] }CafeIcon.png`),
            //                 }}
            //             />
            //         })
            //     }
        
            //     <InfoWindow onClose={this.onInfoWindowClose}>
            //         <div>
            //             <h1>{this.state.queryState.cityLock.name}</h1>
            //         </div>
            //     </InfoWindow>
            // </Map>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: (CONSTS.MAPS_EMBED_KEY)
})(CafeMap)
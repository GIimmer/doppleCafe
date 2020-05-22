import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { GoogleApiWrapper, Map, InfoWindow, Marker } from 'google-maps-react'
import { CONSTS } from "../../constants/Constants"

const GROUPCOLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

function mapStateToProps(state=Map()) {
    return {
        highlightCafeId: state.get('highlightedCafe'),
        similarCafes: state.get('similarCafes'),
        cityLock: state.get('cityLock')
    }
}

export class CafeMap extends PureComponent {

    onMarkerClick(marker) {
        let place_id = marker.id;
        console.log('in marker click: ', place_id);
    }

    onInfoWindowClose() {
        console.log('info window closed');
    }

    render() {
        const similarCafes = this.props.similarCafes.toJS()
        return (
            // <div></div>
            <Map
            google={this.props.google}
            initialCenter={{
                lat: this.props.cityLock.get('lat'),
                lng: this.props.cityLock.get('lng')
            }}
            zoom={13}>
                {
                    similarCafes.map((cafe) => {
                        let markerColor = cafe.placeId === this.props.highlightCafeId ? 
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
                        <h1>{this.props.cityLock.get('name')}</h1>
                    </div>
                </InfoWindow>
            </Map>
        )
    }
}

export default connect(mapStateToProps)(GoogleApiWrapper({
    apiKey: (CONSTS.MAPS_EMBED_KEY)
})(CafeMap))


// export default GoogleApiWrapper({
//     apiKey: (CONSTS.MAPS_EMBED_KEY)
// })(CafeMap)
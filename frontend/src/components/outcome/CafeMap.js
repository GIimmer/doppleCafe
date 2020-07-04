import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { GoogleApiWrapper, Map, InfoWindow, Marker } from 'google-maps-react'
import { CONSTS } from "../../constants/Constants"

const GROUPCOLORS = ['grey', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'grey', 'grey'];

function mapStateToProps(state=Map()) {
    return {
        highlightCafeId: state.get('highlightedCafe'),
        returnedCafes: state.get('returnedCafes'),
        cityLock: state.get('cityLock')
    }
}

export class CafeMap extends PureComponent {
    onMarkerClick(marker) {
        let place_id = marker.id;
        console.log('in marker click: ', place_id);
    }

    render() {
        const returnedCafes = this.props.returnedCafes.toJS(),
            idxToGroupRef = returnedCafes.map((group, idx) => new Array(group.length).fill(idx + 1, 0, group.length)).flat(),
            flatCafes = returnedCafes.flat();
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
                    flatCafes.map((cafe, cafeIdx) => {
                        let marker = cafe.placeId === this.props.highlightCafeId ? 
                            'black' :
                            idxToGroupRef[cafeIdx];
                        return <Marker 
                            onClick={this.onMarkerClick}
                            key={cafe.placeId}
                            placeId={cafe.placeId}
                            name={cafe.name} 
                            title={cafe.name}
                            position={{ lat: cafe.lat, lng: cafe.lng }}
                            icon={{
                                url: require(`../../images/${marker}_marker.png`),
                            }}
                        />
                    }) 
                }
            </Map>
        )
    }
}

export default connect(mapStateToProps)(GoogleApiWrapper({
    apiKey: (CONSTS.MAPS_EMBED_KEY)
})(CafeMap))
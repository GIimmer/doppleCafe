import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react'
import { CONSTS } from "../../constants/Constants"

function getIdxToMarkerNum(returnedCafes, searchingBySimilar) {
    if (searchingBySimilar) {
        return Array.from(Array(10), (_, i) => i + 1);
    } else {
        return returnedCafes.map((group, idx) => new Array(group.length).fill(idx + 1, 0, group.length)).flat();
    }
}

export class CafeMap extends PureComponent {
    onMarkerClick(marker) {
        let place_id = marker.id;
        console.log('in marker click: ', place_id);
    }

    render() {
        const searchingBySimilar = this.props.searchingBySimilar,
            allReturnedCafes = this.props.returnedCafes.toJS(),
            returnedCafes = searchingBySimilar ? allReturnedCafes[1] : allReturnedCafes;

        const idxToGroupRef = getIdxToMarkerNum(returnedCafes, this.props.searchingBySimilar),
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
                        let markerSrc = idxToGroupRef[cafeIdx],
                            cafeIsHighlighted = cafe.placeId === this.props.highlightCafeId
                        if (cafeIsHighlighted) {
                            markerSrc = 'gold_' + markerSrc
                        }
                        return <Marker 
                            onClick={this.onMarkerClick}
                            key={cafe.placeId}
                            placeId={cafe.placeId}
                            name={cafe.name} 
                            title={cafe.name}
                            animation={cafeIsHighlighted ? this.props.google.maps.Animation.DROP : undefined}
                            position={{ lat: cafe.lat, lng: cafe.lng }}
                            icon={{
                                url: require(`../../images/${markerSrc}_marker.png`),
                            }}
                        />
                    }) 
                }
            </Map>
        )
    }
}

function mapStateToProps(state=Map(), props) {
    const currentTab = props.location.pathname.substr(1);
    return {
        highlightCafeId: state.get('highlightedCafe'),
        searchingBySimilar: (currentTab === CONSTS.QUERY_OUTCOME_VIEW),
        returnedCafes: state.get('returnedCafes'),
        cityLock: state.get('cityLock')
    }
}

export default withRouter(connect(mapStateToProps)(GoogleApiWrapper({
    apiKey: (CONSTS.MAPS_EMBED_KEY)
})(CafeMap)))
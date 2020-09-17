import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Map, Marker } from 'google-maps-react'
import { CONSTS } from "../../constants/Constants"
import { mapMarkerClickedFunc } from '../../actions/outcomeActions'

function getIdxToMarkerNum(returnedCafes, searchingBySimilar) {
    if (searchingBySimilar) {
        return Array.from(Array(10), (_, i) => i + 1);
    } else {
        return returnedCafes.map((group, idx) => new Array(group.length).fill(idx + 1, 0, group.length)).flat();
    }
}

function getCafes(props) {
    let allReturnedCafes = props.returnedCafes.toJS();
    return props.searchingBySimilar ? allReturnedCafes[1] : allReturnedCafes;
}

function getFilteredFlatCafes(props, cafesOnMap) {
    let flatCafes = cafesOnMap.flat();
    if (props.cafeFilter) {
        let filterMap = {};
        props.cafeFilter.forEach(id => filterMap[id] = true);
        flatCafes.forEach(cafe => cafe.opacity = filterMap[cafe.placeId] ? 1 : .2);
    }
    return flatCafes;
}

export class CafeMap extends PureComponent {
    onMarkerClick(marker) {
        let placeId = marker.placeId;

        let cafePreview = document.getElementById(placeId);
        cafePreview.scrollIntoView({ block: 'center' });

        this.props.mapMarkerClicked(placeId);
    }

    render() {
        const cafesOnMap = getCafes(this.props);
        const idxToGroupRef = getIdxToMarkerNum(cafesOnMap, this.props.searchingBySimilar);
        const cafesToDisplay = getFilteredFlatCafes(this.props, cafesOnMap);

        return (
            <div>
                <Map
                gestureHandling="cooperative"
                google={window.google}
                initialCenter={{
                    lat: this.props.cityLock.get('lat'),
                    lng: this.props.cityLock.get('lng')
                }}
                zoom={13}>
                    {
                        cafesToDisplay.map((cafe, cafeIdx) => {
                            let markerSrc = idxToGroupRef[cafeIdx],
                                cafeIsHighlighted = cafe.placeId === this.props.highlightCafeId
                            if (cafeIsHighlighted) {
                                markerSrc = 'gold_' + markerSrc
                            }
                            return <Marker 
                                onClick={this.onMarkerClick.bind(this)}
                                key={cafe.placeId}
                                placeId={cafe.placeId}
                                opacity={cafe.opacity}
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
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mapMarkerClicked: mapMarkerClickedFunc(dispatch)
    }
}

function mapStateToProps(state=Map(), props) {
    const currentTab = props.location.pathname.replace(/\\|\//g,''),
        cafeFilter = state.get('cafeFilter');
    return {
        highlightCafeId: state.get('highlightedCafe'),
        searchingBySimilar: (currentTab === CONSTS.QUERY_OUTCOME_VIEW),
        returnedCafes: state.get('returnedCafes'),
        cityLock: state.get('cityLock'),
        cafeFilter: cafeFilter ? cafeFilter.toJS() : null
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CafeMap));
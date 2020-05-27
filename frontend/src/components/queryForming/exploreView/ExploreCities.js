import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactGlobe from 'react-globe'
import earthTexture from '../../../images/2_no_clouds_8k.jpg'
// import { Marker, defaultDotMarkerOptions } from 'react-globe'
import { exploreCityFunc } from '../../../actions/queryActions'

const markerOptions = {
    getTooltipContent: (marker) => 'Explore ' + marker.name + ', ' + marker.country,
}

const lightOptions = {
    pointLightIntensity: 1.1,
    // pointLightColor: 'red',
    ambientLightColor: '#69b9ff',
    ambientLightIntensity: .9,
}

const globeOptions = {
    texture: earthTexture,
    glowColor: '#abd8ff',
    // enableBackground: false,
}

function mapStateToProps(state) {
    return {
        cities: state.get('preLoadedCities')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        exploreCity: exploreCityFunc(dispatch)
    }
}
class ExploreCities extends Component {
    constructor(props) {
        super(props)
    }

    markersFromCities(cityOptions) {
        return cityOptions.map((city) => {
            const {lat, lng, ...rest} = city;
            const baseMarkerObj = {
                coordinates: [lat, lng],
                value: 5
            }
            return Object.assign(baseMarkerObj, rest);
        })
    }

    onClickMarker = ((marker) => {
        this.props.exploreCity(marker.id);
    }).bind(this)

    render() {
        let cityMarkers = this.markersFromCities(this.props.cities.toJS())
        return (
            <div id="exploreView">
                <ReactGlobe
                    markers={cityMarkers}
                    onClickMarker={this.onClickMarker}
                    globeOptions={globeOptions}
                    lightOptions={lightOptions}
                    markerOptions={markerOptions} />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreCities)

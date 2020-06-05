import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactGlobe from 'react-globe'
import earthTexture from '../../../images/2_no_clouds_8k.jpg'
// import { Marker, defaultDotMarkerOptions } from 'react-globe'
import { optionLockToggledFunc } from '../../../actions/queryActions'
import theme from '../../../styles/muiTheme'

const markerOptions = {
    getTooltipContent: (marker) => 'Explore ' + marker.name + ', ' + marker.country,
    
}

const lightOptions = {
    pointLightIntensity: .8,
    pointLightColor: theme.palette.primary.secondary,
    ambientLightColor: theme.palette.primary.secondary,
    ambientLightIntensity: 1.2,
}

const globeOptions = {
    texture: earthTexture,
    glowColor: theme.palette.warning.secondary,
    // enableBackground: false,
}

function mapStateToProps(state) {
    return {
        cities: state.get('preLoadedCities')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        optionLockToggled: optionLockToggledFunc(dispatch)
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

    cityFromMarker(marker) {
        const { coordinates, value, ...city} = marker;
        city.lat = coordinates[0]; city.lng = coordinates[1];
        return city;
    }

    onClickMarker = ((marker) => {
        const cityInQuestion = this.cityFromMarker(marker);
        this.props.optionLockToggled(false, cityInQuestion);
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

import React from 'react'
import { Map, Marker } from 'google-maps-react'

function getMapStyle(displaySmall) {
    return {
        backgroundColor: 'grey',
        height: displaySmall ? '150px' : '300px',
        position: 'relative',
        width: '100%'
    };
}

function ResponseCardMap({ isCafe, response, google, displaySmall, ...rest }) {
    const zoom = isCafe ? 12 : 7;
    return (
        <div style={getMapStyle(displaySmall)}>
            {/* <div style={getMapStyle(displaySmall)}></div> */}
            <Map 
            google={window.google}
            initialCenter={{
                lat: response.lat,
                lng: response.lng
            }}
            zoom={zoom}
            zoomControl={false}
            mapTypeControl={false}
            fullscreenControl={false}
            streetViewControl={false}>
                <Marker name={response.name} />
            </Map>
        </div>
    )
}

export default ResponseCardMap;
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'

const PODIUMCOLORREF = ['gold', 'silver', 'peru'];

function mapStateToProps(state, props) {
    let cafeId = props.cafe.placeId,
        cafeDetails = state.get('cafeDetails'),
        activeCafe = cafeDetails.get('cafeId');

    return {
        isActive: (activeCafe === cafeId),
        detailsLoaded: cafeDetails.getIn([cafeId, 'detailsLoaded'])
    }
}

function getIconStyle(podium) {
    return { 
        fontSize: '24px',
        color: PODIUMCOLORREF[podium - 1],
        transform: `rotate(-60deg)`,
        position: 'absolute',
        top: '-10px',
        left: '-23px'
    }
}


export class CafePreview extends Component {
    render() {
        const cafe = this.props.cafe,
            cafeHasLoc = (cafe.lat || cafe.lng),
            isDNFriendly = cafe.dnScore > 1,
            parentSelf = this.props.parentContext;
        let onAction = this.props.handleAction;
        return (
            <div className={`cafePreview${this.props.isActive ? " glow" : ""}${isDNFriendly ? " dnFriendly" : ""}`}
            onMouseEnter={onAction.bind(parentSelf, 'hoverOver', cafe)}>
                <h1>{cafe.similarityRank}</h1>
                <div className="cafeInformation">
                    <p><b>{cafe.name}</b></p>
                    <p>{cafe.rating} stars</p>
                </div>
                <div className="previewButtons">
                    <Button 
                        variant="contained"
                        size="small"
                        disabled={this.props.detailsLoaded}
                        onClick={onAction.bind(parentSelf, 'loadDetails', cafe)}
                    >{cafe.website ? 'View ' : 'Load '}more details</Button>
                    <Button 
                        variant="contained"
                        size="small"
                        disabled={!cafeHasLoc}
                        onClick={onAction.bind(parentSelf, 'mapHighlight', cafe)}
                    >{cafeHasLoc ? 'Highlight on map' : 'Location not provided'}</Button>
                </div>
                {
                    !!cafe.dnPodium &&
                    <i class='fas fa-crown' style={getIconStyle(cafe.dnPodium)}></i>
                }
            </div>
        )
    }
}

export default connect(mapStateToProps)(CafePreview)

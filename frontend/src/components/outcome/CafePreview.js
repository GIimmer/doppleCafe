import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'

function mapStateToProps(state, props) {
    let cafeId = props.cafe.placeId,
        cafeDetails = state.get('cafeDetails'),
        activeCafe = cafeDetails.get('cafeId');

    return {
        isActive: (activeCafe === cafeId),
        detailsLoaded: cafeDetails.getIn([cafeId, 'detailsLoaded'])
    }
}

export class CafePreview extends Component {
    render() {
        const cafe = this.props.cafe,
            cafeHasLoc = (cafe.lat || cafe.lng),
            parentSelf = this.props.parentContext;
        let onAction = this.props.handleAction;
        return (
            <div className={`cafePreview${this.props.isActive ? " glow" : ""}`}
            onMouseEnter={onAction.bind(parentSelf, 'hoverOver', cafe)}>
                <h1>{cafe.similarityRank}</h1>
                <div className="cafeInformation">
                    <p><b>{cafe.name}</b></p>
                    <p>{cafe.rating} stars</p>
                </div>
                <div className="cafePreviewButtons">
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
            </div>
        )
    }
}

export default connect(mapStateToProps)(CafePreview)

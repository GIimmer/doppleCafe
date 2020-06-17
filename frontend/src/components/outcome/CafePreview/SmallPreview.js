import React from 'react'
import { connect } from 'react-redux'
import { IconButton } from '@material-ui/core'
import LocationOn from '@material-ui/icons/LocationOn'
import Tooltip from '@material-ui/core/Tooltip';
// import AddIcon from '@material-ui/icons/Add';
// import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
// import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import QueuePlayNextIcon from '@material-ui/icons/QueuePlayNext';

export function SmallPreview(props) {
    const cafe = props.cafe,
        cafeHasLoc = (cafe.lat || cafe.lng),
        parentSelf = props.parentContext;
    let onAction = props.handleAction;

    return (
        <div className={`cafePreview smallPreview${props.isActive ? " glow" : ""}`}
            onMouseEnter={onAction.bind(parentSelf, 'hoverOver', cafe)}>
                <div className="cafeInformation">
                    <p><b>{cafe.name}</b></p>
                    <p>{cafe.rating} stars</p>
                </div>
                <div className="previewButtons smallPreviewButtons">
                    <Tooltip title={!props.detailsLoaded ? `${cafe.website ? 'View' : 'Load'} more details` : ''} aria-label="View more details">
                        <IconButton
                            aria-label="Load more details"
                            disabled={props.detailsLoaded}
                            onClick={onAction.bind(parentSelf, 'loadDetails', cafe)}
                            component="span">
                            <QueuePlayNextIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={cafeHasLoc ? 'Highlight on map' : 'Location not found'} aria-label="Highlight on map">
                        <IconButton
                            aria-label="Highlight on map"
                            disabled={!cafeHasLoc}
                            onClick={onAction.bind(parentSelf, 'mapHighlight', cafe)}
                            component="span">
                            <LocationOn />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
    )
}

function mapStateToProps(state, props) {
    let cafeId = props.cafe.placeId,
    cafeDetails = state.get('cafeDetails'),
    activeCafe = cafeDetails.get('cafeId');

    return {
        isActive: (activeCafe === cafeId),
        detailsLoaded: cafeDetails.getIn([cafeId, 'detailsLoaded'])
    }
}

export default connect(mapStateToProps)(SmallPreview);
import React from 'react'
import { IconButton } from '@material-ui/core'
import LocationOn from '@material-ui/icons/LocationOn'
import Tooltip from '@material-ui/core/Tooltip';
import QueuePlayNextIcon from '@material-ui/icons/QueuePlayNext';

export default function PreviewButtonsSmall(props) {
    const cafe = props.cafe;
    const onAction = props.handleAction;

    return (
        <div className="previewButtons smallPreviewButtons">
            <Tooltip title={!props.detailsLoaded ? `${cafe.website ? 'View' : 'Load'} more details` : ''} aria-label="View more details">
                <IconButton
                    aria-label="Load more details"
                    disabled={props.detailsLoaded}
                    onClick={onAction.bind(props.parentSelf, 'loadDetails', cafe)}
                    component="span">
                    <QueuePlayNextIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={cafe.lat ? 'Highlight on map' : 'Location not found'} aria-label="Highlight on map">
                <IconButton
                    aria-label="Highlight on map"
                    disabled={!cafe.lat}
                    onClick={onAction.bind(props.parentSelf, 'mapHighlight', cafe)}
                    component="span">
                    <LocationOn />
                </IconButton>
            </Tooltip>
        </div>
    )
}

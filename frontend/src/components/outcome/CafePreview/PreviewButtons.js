import React from 'react'
import Button from '@material-ui/core/Button';

export default function PreviewButtons(props) {
    const cafe = props.cafe;
    const onAction = props.handleAction;

    return (
        <div className="previewButtons">
            <Button
                aria-label="Load more details"
                variant="outlined"
                disabled={props.detailsLoaded}
                onClick={onAction.bind(props.parentSelf, 'loadDetails', cafe)}
                component="span">
                    {`${cafe.website ? 'View' : 'Load'} more details`}
            </Button>
            <Button
                aria-label="Highlight on map"
                disabled={!cafe.lat}
                variant="outlined"
                onClick={onAction.bind(props.parentSelf, 'mapHighlight', cafe)}
                component="span">
                    {cafe.lat ? 'Highlight on map' : 'Location not found'}
            </Button>
        </div>
    )
}

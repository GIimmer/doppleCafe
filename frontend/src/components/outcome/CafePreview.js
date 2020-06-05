import React from 'react'
import Button from '@material-ui/core/Button';

export default function CafePreview(props) {
    const cafe = props.cafe,
        cafeHasLoc = (cafe.lat || cafe.lng),
        parentSelf = props.parentContext;
    let onAction = props.handleAction;

    return (
        <div className="cafePreview" 
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
                    disabled={cafe.detailsLoaded}
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

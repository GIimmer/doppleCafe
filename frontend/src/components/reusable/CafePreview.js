import React from 'react'
import Button from '@material-ui/core/Button';

export default function CafePreview(props) {
    const cafe = props.cafe;
    let onClick = props.handleClick;

    return (
        <div className="cafePreview" onMouseOver={onClick.bind(this, 'hoverOver', cafe.placeId)}>
            <h1>{cafe.similarityRank}</h1>
            <div className="cafeInformation">
                <p><b>{cafe.name}</b></p>
                <p>{cafe.rating} stars</p>
            </div>
            <div className="cafePreviewButtons">
                <Button 
                    variant="contained" 
                    color="default" 
                    size="small"
                    onClick={onClick.bind(this, 'loadDetails', cafe.placeId)}
                >{cafe.website ? 'View ' : 'Load '}more details</Button>
                <Button 
                    variant="contained" 
                    color="default" 
                    size="small"
                    onClick={onClick.bind(this, 'mapHighlight', cafe.placeId)}
                >Highlight on map</Button>
            </div>
        </div>
    )
}

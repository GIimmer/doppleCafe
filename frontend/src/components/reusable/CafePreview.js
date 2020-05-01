import React from 'react'
import Button from '@material-ui/core/Button';

export default function CafePreview(props) {
    const cafe = props.cafe;
    let onClick = props.handleClick;

    return (
        <div className="cafePreview">
            <h1>{cafe.similarityRank}</h1>
            <div className="cafeInformation">
                <p>Name: {cafe.name}</p>
                <p>Rating: {cafe.rating}</p>
            </div>
            <div className="cafePreviewButtons">
                <Button 
                    variant="contained" 
                    color="secondary" 
                    size="small"
                    onClick={onClick.bind(this, 'loadDetails', cafe.id)}
                >Load more details</Button>
                <Button 
                    variant="contained" 
                    color="secondary" 
                    size="small"
                    onClick={onClick.bind(this, 'mapHighlight', cafe.id)}
                >Highlight on map</Button>
            </div>
        </div>
    )
}

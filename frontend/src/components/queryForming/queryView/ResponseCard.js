import React from 'react'
import Card from '@material-ui/core/Card'
import CONSTS from '../../../constants/Constants'
import { genGooglePlacePhoto } from "../../../utilities/utilities"
import ResponseCardMap from './ResponseCardMap'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'

const cardStyleGenerator = (isCafe, unSelected, displaySmall) => {
    let base = {
        root: {
            margin: '10px 0px', 
            position: 'relative',
            width: '100%'
        },
        content: {
            position: 'relative',
            padding: 0,
            width: '100%'
        },
        media: {
            height: 140,
            width: '100%'
        },
        overlay: {
            color: 'white'
        }
    }

    base.media.filter = isCafe ? 
    'brightness(40%) sepia(100%) hue-rotate(330deg) saturate(180%)'
    :
    'brightness(40%) sepia(100%) hue-rotate(150deg) saturate(180%)';

    if (displaySmall) {
        base.root.width = 220;
    }
 
    if (unSelected) {
        base.root.opacity = .5;
    }

    return base;
}


export function ResponseCard(props) {
    let title, subTitle, image,
        response = props.response,
        isCafe = props.field === 'cafe',
        displaySmall = props.displaySmall;

    if (isCafe) {
        subTitle = response.formattedAddress;
        image = genGooglePlacePhoto(response.photos[0]);
    } else {
        subTitle = response.country;
        image = response.photo_src ? response.photo_src : CONSTS.CITY_PHOTO_STANDIN;
    }
    title = response.name;
    const cardStyles = cardStyleGenerator(isCafe, response.locked === false, displaySmall)
    
    return (
        <Card style={cardStyles.root} className={response.locked ? 'glow' : ''} onClick={props.handleClick}>
            <ResponseCardMap isCafe={isCafe} response={response} displaySmall={displaySmall} />
            <CardContent style={cardStyles.content}>
                <CardMedia style={cardStyles.media}
                    image={image}
                    title={"Picture of " + props.field}
                />
                <div className="overlay" style={cardStyles.overlay}>
                    <h2 style={ displaySmall ? { fontSize: '1.1em', margin: '20px 15px' } : { fontSize: '1.7em', margin: '20px 15px' }}>{title}</h2>
                    <h5 style={ displaySmall ? { fontSize: '.8em', marginLeft: 15 } : { fontSize: '1em', marginLeft: 15 }}>{subTitle}</h5>
                </div>
            </CardContent>
            {
                response.locked !== false &&
                <div className={`overlay ${response.locked !== false ? 'hoverOverlay' : ''}`}>
                    <h3 style={{ display: 'inline-block' }}>{response.locked ? 'Deselect?' : `Select this ${props.field}?`}</h3>
                </div>
            }
            {
                response.locked === true &&
                <i className={`fas fa-lock ${displaySmall ? 'fa-2x' : 'fa-3x'}`}></i>
            }
        </Card>
    )
}

export default ResponseCard;
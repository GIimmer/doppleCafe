import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import CONSTS from '../constants/Constants'
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const cardStyleGenerator = (isCafe, unSelected) => {
    let base = {
        root: {
            margin: '10px 0px', 
            position: 'relative'
        },
        map: {
            backgroundColor: 'grey',
            height: 150,
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

    if (isCafe) {
        base.root.width = 220;
        base.media.filter = 'brightness(40%) sepia(100%) hue-rotate(335deg) saturate(200%)';
    } else {
        base.root.width = '100%';
        base.media.filter = 'brightness(40%) sepia(100%) hue-rotate(170deg) saturate(200%)';
        base.map.height = '300px';
    }

    if (unSelected) {
        base.root.opacity = .5;
    }

    return base;
}


export default function ResponseCard(props) {
    let title, subTitle, image, src, zoom,
        response = props.response,
        isCafe = props.field === 'cafe';

    if (isCafe) {
        subTitle = response.formattedAddr;
        zoom = 12;
    } else {
        subTitle = response.country;
        zoom = 7;
    }
    title = response.name;
    image = response.photos[0];
    src = `${CONSTS.GOOGLE_EMBED_BASE}key=${CONSTS.MAPS_EMBED_KEY}&center=${response.latitude},${response.longitude}&zoom=${zoom}`;

    const cardStyles = cardStyleGenerator(isCafe, response.locked === false)

    
    return (
        <Card style={cardStyles.root} className={response.locked ? 'glow' : ''} onClick={props.handleClick}>
            <div style={cardStyles.map}></div>
            {/* <iframe height="200"  width="300" style={cardStyles.map} frameBorder="0" src={src} allowFullScreen></iframe> */}
            <CardContent style={cardStyles.content}>
                <CardMedia style={cardStyles.media}
                    image={image}
                    title={"Picture of " + props.field}
                />
                <div className="overlay" style={cardStyles.overlay}>
                    <h2 style={ isCafe ? { fontSize: '1.1em', margin: '20px 15px' } : { fontSize: '1.7em', margin: '20px 15px' }}>{title}</h2>
                    <h5 style={isCafe ? { fontSize: '.8em', marginLeft: 15 } : { fontSize: '1em', marginLeft: 15 }}>{subTitle}</h5>
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
                <i className={`fas fa-lock ${props.field === 'cafe' ? 'fa-2x' : 'fa-3x'}`}></i>
            }
        </Card>
    )
}

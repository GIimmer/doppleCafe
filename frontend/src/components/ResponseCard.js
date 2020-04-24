import React from 'react'
import Card from '@material-ui/core/Card'
import CONSTS from '../constants/Constants'
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const cardStyleGenerator = (isCity=false) => {
    let base = {
        root: {},
        map: {
            backgroundColor: 'grey',
            height: 100,
            width: '100%'
        },
        content: {
            position: 'relative',
            width: '100%',
            padding: 0
        },
        media: {
            height: 140,
            width: '100%'
        },
        overlay: {
            position: 'absolute',
            top: '15px',
            left: '20px',
            color: 'white',
        }
    }
    if (isCity) {
        base.root.width = '100$';
        base.media.filter = 'brightness(40%) sepia(100%) hue-rotate(170deg) saturate(200%)';
    } else {
        base.root.width = 200;
        base.media.filter = 'brightness(40%) sepia(100%) hue-rotate(335deg) saturate(200%)';
    }
    return base;
}


export default function ResponseCard(props) {


    let title, subTitle, image, src, response;
    if (props.field === 'cafe') {
        response = props.queryState.cafeResponse;
        subTitle = response.formattedAddr;
    } else {
        response = props.queryState.cityResponse;
        subTitle = response.country;
    }
    title = response.name;
    image = response.photos[0];
    src = `${CONSTS.GOOGLE_EMBED_BASE}key=${CONSTS.MAPS_EMBED_KEY}&center=${response.latitude},${response.longitude}&zoom=18`;

    const cardStyles = cardStyleGenerator(props.field === 'city')

    
    return (
        <Card style={cardStyles.root}>
            <div style={cardStyles.map}></div>
            {/* <iframe height="200"  width="300" style={cardStyles.map} frameborder="0" src={src} allowFullScreen></iframe> */}
            <CardContent style={cardStyles.content}>
                <CardMedia style={cardStyles.media}
                    image={image}
                    title={"Picture of " + props.field}
                />
                <div style={cardStyles.overlay}>
                    <h2>{title}</h2>
                    <h5>{subTitle}</h5>
                </div>
            </CardContent>
        </Card>
    )
}

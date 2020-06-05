import React from 'react'

const getStyle = (field, photoUrl) => {
    let style = { backgroundImage: `url(${photoUrl})` }
    style['filter'] = field === 'cafe' ?
        'brightness(40%) sepia(100%) hue-rotate(330deg) saturate(180%)' :
        'brightness(40%) sepia(100%) hue-rotate(150deg) saturate(180%)';
    return style;
}

export default function ViewingBox(props) {
    return (
        <div className="viewBox" >
            <img style={getStyle(props.field, props.photo)} alt={`${props.field}`}></img>
            <h2>{props.title}</h2>
            <h4>{props.subtitle}</h4>
        </div>
    )
}

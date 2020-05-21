import React from 'react'

const getStyle = (field, photoUrl) => {
    let style = { backgroundImage: `url(${photoUrl})` }
    style['filter'] = field === 'cafe' ?
        'brightness(40%) sepia(100%) hue-rotate(335deg) saturate(200%)' :
        'brightness(40%) sepia(100%) hue-rotate(170deg) saturate(200%)';
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

import React from 'react'

const DAYIDS = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
const hourStringGen = (openCloseArray) => {
    const openVal = openCloseArray[0], closeVal = openCloseArray[1];
    let openHours = openVal.slice(0, 2), openMinutes = ':' + openVal.slice(2,4),
        closeHours = closeVal.slice(0,2), closeMinutes = ':' + closeVal.slice(2,4);

    let open = parseInt(openHours), openAm = open < 12,
        close = parseInt(closeHours), closeAm = close < 12;
    
    let openRevised = open % 12, closeRevised = close % 12;
    let openString = `${openRevised.toString(10)}${openMinutes !== ':00' ? openMinutes : ''}${openAm ? 'am' : 'pm'}`,
        closeString = `${closeRevised.toString(10)}${closeMinutes !== ':00' ? closeMinutes : ''}${closeAm ? 'am' : 'pm'}`
    
    return openString + ' - ' + closeString;
}

export default function CafeHours(props) {
    const hours = props.hours !== 'unset' ? JSON.parse(props.hours) : null;
    return (
        <ul>
            {
                hours &&
                hours.map((day, idx) => {
                    return <li key={idx}><span>{DAYIDS[idx]}: </span><span>{hourStringGen(day)}</span></li>
                })
            }
        </ul>
    )
}

import React from 'react'
import CafeHours from './CafeHours'

export default function CafeInformation(props) {
    return (
        <div className="cafeInformation">
            <div className="infoSection">
                <div>
                    <h2>{props.cafe.name}</h2>
                    <h5>{props.cafe.formattedAddress}</h5>
                </div>
                <div>
                    <p>rating: <strong>{props.cafe.rating}</strong></p>
                    <p>price level: <strong>{props.cafe.priceLevel}/5</strong></p>
                </div>                                
            </div>
            <div className="infoSection contactSection">
                <div>
                    <a href={props.cafe.website} target="_blank" rel="noopener noreferrer">
                        {props.cafe.website}
                    </a>
                    <span>{props.cafe.formattedPhoneNumber}</span>
                </div>
                <div>
                    <CafeHours hours={props.cafe.hours} />
                </div>
            </div>
        </div>
    )
}

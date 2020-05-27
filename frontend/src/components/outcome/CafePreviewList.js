import React from 'react'
import CafePreview from './CafePreview'

export default function CafePreviewList(props) {
    return (
        <div className="cafePreviewList" onMouseLeave={props.handleAction.bind(props.parentContext, null, false)}>
                <h2>{props.searchingBySimilar ? 'Most similar cafes, ranked in order:' : `Group #${props.groupIdx + 1}:`}</h2>
            {
                props.group.toJS().map(cafe => {
                    return <CafePreview 
                                cafe={cafe} 
                                key={cafe.placeId} 
                                handleAction={props.handleAction} 
                                parentContext={props.parentContext} 
                            />
                })
            }
        </div>
    )
}
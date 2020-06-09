import React from 'react'
import CafePreview from './CafePreview'

function getTitle(groupIdx, searchingBySimilar, weight) {
    if (searchingBySimilar) {
        const weightStr = weight === 'default' ? 'default weighting' : `weighted for ${weight}`;
        return groupIdx === 0 ? 'Target cafe:' : `Most similar cafes, ${weightStr} and ranked in order:`;
    } else {
        return `Group #${groupIdx + 1}:`;
    }
}

export default function CafePreviewList(props) {
    return (
        <div className="cafePreviewList" onMouseLeave={props.handleAction.bind(props.parentContext, null, false)}>
                <h2>{getTitle(props.groupIdx, props.searchingBySimilar, props.weight)}</h2>
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
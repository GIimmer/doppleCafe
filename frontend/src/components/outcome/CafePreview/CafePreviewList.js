import React from 'react'
import CafePreview from './CafePreview'
import ChipsSection from './ChipsSection'

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
                !props.searchingBySimilar &&
                <ChipsSection commonTermsRef={props.commonTermsRef} />              
            }
            {
                props.group.toJS().map((cafe, idx) => {
                    return <CafePreview 
                        cafe={cafe} 
                        fullSizePreview={props.searchingBySimilar}
                        onLeft={props.searchingBySimilar ? true : (idx % 2) !== 1}
                        key={cafe.placeId}
                        handleAction={props.handleAction} 
                        parentContext={props.parentContext} 
                    />
                })
            }
        </div>
    )
}
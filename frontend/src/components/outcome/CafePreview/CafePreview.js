import React from 'react'
import { connect } from 'react-redux'
import PreviewButtons from './PreviewButtons'
import PreviewButtonsSmall from './PreviewButtonsSmall'


const PODIUMCOLORREF = ['gold', 'silver', 'peru'];

function getCrown(onLeft, podium) {
    return { 
        fontSize: '24px',
        color: PODIUMCOLORREF[podium - 1],
        transform: `rotate(${onLeft ? '-60' : '60'}deg)`,
        position: 'absolute',
        top: '-10px',
        left: onLeft ? '-23px' : undefined,
        right: onLeft ? undefined : '-23px'
    }
}

function getPreviewClassname(fullSize, active, dnFriendly, filteredOut) {
    let classNameBase = `cafePreview ${fullSize ? "" : " smallPreview"}`
    return `${classNameBase}${filteredOut ? ' filteredOut' : ''}${active ? " glow" : ""}${dnFriendly ? " dnFriendly" : ""}`;
}


export function CafePreview(props) {
    const cafe = props.cafe,
        isDNFriendly = props.highlightRWFriendly && cafe.dnScore > 1,
        parentSelf = props.parentContext,
        cafeFilteredOut = props.cafeFilter && !props.cafeFilter.includes(cafe.placeId);
    let onAction = props.handleAction;

    return (
        <div className={getPreviewClassname(props.fullSizePreview, props.isActive, isDNFriendly, cafeFilteredOut)}
        onMouseEnter={!cafeFilteredOut && onAction.bind(parentSelf, 'hoverOver', cafe)}>
            {
                props.fullSizePreview &&
                <h1>{cafe.similarityRank}</h1>
            }
            <div className="cafeInformation">
                <p><b>{cafe.name}</b></p>
                <p>{cafe.rating} stars</p>
            </div>
            {
                props.fullSizePreview ?
                <PreviewButtons
                    cafe={cafe}
                    detailsLoaded={props.detailsLoaded}
                    parentSelf={parentSelf}
                    handleAction={props.handleAction}
                />
                :
                <PreviewButtonsSmall
                    cafe={cafe}
                    detailsLoaded={props.detailsLoaded}
                    parentSelf={parentSelf}
                    handleAction={props.handleAction}
                />
            }
            {
                props.highlightRWFriendly && cafe.dnPodium &&
                <i className='fas fa-crown' style={getCrown(props.onLeft, cafe.dnPodium)}></i>
            }
            {
                cafeFilteredOut &&
                <div style={{position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(237,244,237,.8)'}}></div>
            }
        </div>
    )
}

function mapStateToProps(state, props) {
    let cafeId = props.cafe.placeId,
        cafeDetails = state.get('cafeDetails'),
        activeCafe = cafeDetails.get('cafeId'),
        cafeFilter = state.get('cafeFilter');

    return {
        isActive: (activeCafe === cafeId),
        cafeFilter: cafeFilter ? cafeFilter.toJS() : null,
        detailsLoaded: cafeDetails.getIn([cafeId, 'detailsLoaded']),
        highlightRWFriendly: state.get('highlightRWFriendly')
    }
}

export default connect(mapStateToProps)(CafePreview);

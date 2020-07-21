import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import CafePreviewList from './CafePreview/CafePreviewList'
import ResultsFilter from './CafePreview/ResultsFilter'
import CONSTS from '../../constants/Constants'
import { parseQueryString } from '../../utilities/utilities'
import { 
    setViewingDetailsFunc,
    loadCafeDetailsFunc,
    highlightCafeOnMapFunc,
    toggleCafeHoverFunc } from '../../actions/outcomeActions'


function mapDispatchToProps(dispatch) {
    return {
        setViewingDetails: setViewingDetailsFunc(dispatch),
        loadCafeDetails: loadCafeDetailsFunc(dispatch),
        highlightCafeOnMap: highlightCafeOnMapFunc(dispatch),
        toggleCafeHover: toggleCafeHoverFunc(dispatch)
    }
}

function mapStateToProps(state=Map(), props) {
    const currentTab = props.location.pathname.replace(/\\|\//g,'');
    return {
        returnedCafes: state.get('returnedCafes'),
        commonTermsRefMap: state.get('commonTermsRefMap'),
        currentTab: currentTab
    }
}

export class CafePreviewListHolder extends Component {
    constructor(props) {
        super(props);
        this.state = parseQueryString(props.location.search);
    }

    handleAction(action, cafe, e) {
        e.preventDefault();
        let cafeId = cafe ? cafe.placeId : null;
        switch (action) {
            case 'loadDetails':
                if (cafe.detailsLoaded) {
                    this.props.setViewingDetails(cafe);
                } else {
                    this.props.loadCafeDetails(cafeId);
                }
                break;

            case 'mapHighlight':
                this.props.highlightCafeOnMap(cafeId);
                window.scrollTo(0,0);
                break;

            case 'hoverOver':
                this.props.toggleCafeHover(cafeId, true);
                break;
        
            default:
                break;
        }
    }

    render() {
        const termsRefMap = this.props.commonTermsRefMap.toJS();
        return (
            <div className="cafePreviewListHolder">
                <ResultsFilter />
                {
                    this.props.returnedCafes.map((group, idx) => {
                        return <CafePreviewList
                            key={group.toString() + '_' + idx.toString()} 
                            group={group}
                            groupIdx={idx}
                            commonTermsRef={termsRefMap[idx]}
                            handleAction={this.handleAction}
                            parentContext={this}
                            weight={this.state.weight}
                            searchingBySimilar={this.props.currentTab === CONSTS.QUERY_OUTCOME_VIEW} 
                        />
                    })
                }
            </div>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CafePreviewListHolder))

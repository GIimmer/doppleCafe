import React, { Component } from 'react'
import { connect } from 'react-redux'
import CafePreviewList from './CafePreviewList'
import CONSTS from '../../constants/Constants'
import { setViewingDetailsFunc, loadCafeDetailsFunc, highlightCafeOnMapFunc, toggleCafeHoverFunc } from '../../actions/outcomeActions';


function mapDispatchToProps(dispatch) {
    return {
        setViewingDetails: setViewingDetailsFunc(dispatch),
        loadCafeDetails: loadCafeDetailsFunc(dispatch),
        highlightCafeOnMap: highlightCafeOnMapFunc(dispatch),
        toggleCafeHover: toggleCafeHoverFunc(dispatch)
    }
}

function mapStateToProps(state=Map()) {
    return {
        returnedCafes: state.get('returnedCafes'),
        currentTab: state.get('currentTab')
    }
}

export class CafePreviewListHolder extends Component {

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
        return (
            <div className="cafePreviewListHolder">
                {
                    this.props.returnedCafes.map((group, idx) => {
                        return <CafePreviewList 
                            group={group}
                            groupIdx={idx}
                            handleAction={this.handleAction} 
                            parentContext={this}
                            searchingBySimilar={this.props.currentTab === CONSTS.QUERY_VIEW} 
                        />
                    })
                }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CafePreviewListHolder)

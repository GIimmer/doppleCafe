import React, { Component } from 'react'
import { connect } from 'react-redux'
import ViewingBox from "./ViewingBox"
import CONSTS from '../../constants/Constants'
import Button from '@material-ui/core/Button'
import { genGooglePlacePhoto } from "../../utilities/utilities"
import { findMostSimilarFunc, clearSearchFunc } from '../../actions/stateActions'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router';


function mapDispatchToProps(dispatch) {
    return {
        clearSearch: clearSearchFunc(dispatch),
        findMostSimilar: findMostSimilarFunc(dispatch)
    }
}

function mapStateToProps(state=Map(), props) {
    const baseMap = {
        cafeLock: state.get('cafeLock'),
        cityLock: state.get('cityLock'),
        searchParamsSet: state.get('searchParamsSet'),
        isExploreView: [CONSTS.EXPLORE_VIEW, CONSTS.EXPLORE_OUTCOME_VIEW].includes(props.location.pathname.substr(1))
    }
    return Object.assign(baseMap, {
        searchParamsLocked: (!!baseMap.cityLock.size && (!!baseMap.cafeLock.size || baseMap.isExploreView))
    })
}


export class ViewingPane extends Component {
    getContainerClass(isExploreView) {
        let baseClass = 'viewingPane';
        if (this.props.searchParamsLocked) {
            baseClass += ' paneMounted';
        }
        if (this.props.searchParamsSet) {
            baseClass += ' paneActive'
        }
        return baseClass;
    }

    linkBuilder(isExploreView, cafe, city) {
        const cafeSegment = isExploreView ? '' : `&cafe=${cafe.placeId}`,
            viewSegment = isExploreView ? CONSTS.EXPLORE_OUTCOME_VIEW : CONSTS.QUERY_OUTCOME_VIEW;
        return `/${viewSegment}?city=${city.id}${cafeSegment}&weight=`;
    }

    render() {
        let cafe = this.props.cafeLock, city = this.props.cityLock;
        if (this.props.searchParamsLocked) {
            cafe = cafe.size ? cafe.toJS() : cafe;
            city = city.size ? city.toJS() : city;
        } else if (this.props.isExploreView) {
            city = city.size ? city.toJS() : city;
        }
        const linkBase = this.linkBuilder(this.props.isExploreView, cafe, city)
        return (
            <div className={this.getContainerClass(this.props.isExploreView)}>
                {
                    this.props.searchParamsSet ?
                    <div className="selectionsHolder">
                        <Button id="cancelButton" 
                        variant="contained" 
                        color="secondary" 
                        size="small"
                        onClick={this.props.clearSearch}>
                            Cancel Search
                        </Button>
                        {
                            !this.props.isExploreView &&
                            <ViewingBox field="cafe" photo={genGooglePlacePhoto(cafe.photos[0])} title={cafe.name} subtitle={cafe.formattedAddress} />
                        }
                        <ViewingBox field="city" photo={city.photo_src} title={city.name} subtitle={city.country} />
                    </div>
                    :
                    <div className="selectionsHolder">
                        {
                            this.props.searchParamsLocked &&
                            <>
                                <Button color="secondary"  component={Link} to={linkBase + 'ambience'} >Emphasize ambience?</Button>
                                <Button color="primary" component={Link} to={linkBase + 'normal'} >Search?</Button>
                                <Button color="secondary" component={Link} to={linkBase + 'food'}>Emphasize food?</Button>
                            </>
                        }
                    </div>
                }
            </div>
        )
    }
}

const ViewingPaneWithRouter = withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewingPane));

export default ViewingPaneWithRouter;

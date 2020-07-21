import React, { Component } from 'react'
import { connect } from 'react-redux'
import ViewingBox from "./ViewingBox"
import CONSTS from '../../constants/Constants'
import Button from '@material-ui/core/Button'
import { genGooglePlacePhoto } from "../../utilities/utilities"
import { findMostSimilarFunc, clearSearchFunc } from '../../actions/stateActions'
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom'


function mapDispatchToProps(dispatch) {
    return {
        clearSearch: clearSearchFunc(dispatch),
        findMostSimilar: findMostSimilarFunc(dispatch)
    }
}

function mapStateToProps(state=Map(), props) {
    const pathname = props.location.pathname.replace(/\\|\//g,'');
    const baseMap = {
        cafeLock: state.get('cafeLock'),
        cityLock: state.get('cityLock'),
        searchParamsSet: [CONSTS.QUERY_OUTCOME_VIEW, CONSTS.EXPLORE_OUTCOME_VIEW].includes(pathname),
        isExploreView: [CONSTS.EXPLORE_VIEW, CONSTS.EXPLORE_OUTCOME_VIEW].includes(pathname)
    }
    return Object.assign(baseMap, {
        searchParamsLocked: (!!baseMap.cityLock && baseMap.cityLock.size && (!!baseMap.cafeLock.size || baseMap.isExploreView)),
    })
}


export class ViewingPane extends Component {
    getContainerClass() {
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

    handleCancelClick() {
        this.props.clearSearch();
        this.props.history.push(`/${CONSTS.QUERY_VIEW}`);
    }

    render() {
        let cafe = this.props.cafeLock, city = this.props.cityLock;
        let linkBase;
        if (this.props.searchParamsLocked) {
            cafe = cafe.size ? cafe.toJS() : cafe;
            city = city.size ? city.toJS() : city;
            linkBase = this.linkBuilder(this.props.isExploreView, cafe, city);
        }
        return (
            <div className={this.getContainerClass(this.props.isExploreView)}>
                {
                    linkBase && this.props.searchParamsSet ?
                    <div className="selectionsHolder">
                        <Button id="cancelButton" 
                        variant="contained"
                        size="small"
                        onClick={this.handleCancelClick.bind(this)}>
                            Cancel Search
                        </Button>
                        {
                            !this.props.isExploreView &&
                            <ViewingBox field="cafe" photo={genGooglePlacePhoto(cafe.photos[0])} title={cafe.name} subtitle={cafe.formattedAddress} />
                        }
                        <ViewingBox field="city" photo={city.photo_src} title={city.name} subtitle={city.country} />
                    </div>
                    :
                    <div className="selectionsHolder" style={{ width: '10vw'}}>
                        {
                            !this.props.searchParamsSet && this.props.searchParamsLocked &&
                            <>
                                <Button className="weightButton largerButton" component={Link} to={linkBase + 'ambience'} >Emphasize ambience</Button>
                                <Button className="weightButton" component={Link} to={linkBase + 'normal'} >Default emphasis</Button>
                                <Button className="weightButton largerButton" component={Link} to={linkBase + 'food'}>Emphasize food</Button>
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

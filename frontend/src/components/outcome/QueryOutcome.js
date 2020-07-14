import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import CafeMap from './CafeMap'
import CafePreviewListHolder from './CafePreviewListHolder'
import CafeDetailsWrapper from './CafeDetailsWrapper'
import { css } from "@emotion/core"
import RingLoader from "react-spinners/RingLoader"
import { getWordBagRefFunc, setTermPresenceRefFunc } from '../../actions/outcomeActions'
import { findMostSimilarFunc, exploreCityFunc } from '../../actions/stateActions'
import { parseQueryString } from '../../utilities/utilities'
import { CONSTS } from '../../constants/Constants'


const override = css`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
`;

function mapDispatchToProps(dispatch) {
    return {
        getWordBagRef: getWordBagRefFunc(dispatch),
        findMostSimilar: findMostSimilarFunc(dispatch),
        exploreCity: exploreCityFunc(dispatch),
        setTermPresenceRef: setTermPresenceRefFunc(dispatch)
    }
}

function mapStateToProps(state=Map(), props) {
    return {
        loading: !state.get('cafesReturned'),
        returnedCafes: state.get('returnedCafes'),
        isExploreView: props.location.pathname === `/${CONSTS.EXPLORE_OUTCOME_VIEW}`
    }
}

export class QueryOutcome extends Component {
    constructor(props) {
        super(props)
        let queryString = props.location.search;
        this.state = parseQueryString(queryString);
        props.isExploreView ? props.exploreCity(queryString, this.state.city) : props.findMostSimilar(queryString);
    }

    componentDidMount() {
        this.props.getWordBagRef();
    }

    componentDidUpdate() {
        if (!!this.props.returnedCafes) {
            this.props.setTermPresenceRef();
        }
    }

    render() {
        return (
            <div id="OutcomeSection">
                <div id="QueryOutcome">
                    {
                        this.props.loading ?
                        <RingLoader
                            css={override}
                            size={60}
                            color={"#123abc"}
                        />
                        :
                        <div className="cafePreviewHolder">
                            <CafeMap />
                            <div className="flexRowParent">
                                <CafePreviewListHolder />
                                <CafeDetailsWrapper />
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryOutcome)

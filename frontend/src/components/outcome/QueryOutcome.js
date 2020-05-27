import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import CafeMap from './CafeMap'
import CafePreviewListHolder from './CafePreviewListHolder'
import CafeDetailsWrapper from './CafeDetailsWrapper'
import { css } from "@emotion/core"
import RingLoader from "react-spinners/RingLoader"
import { getWordBagRefFunc } from '../../actions/outcomeActions'


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
        getWordBagRef: getWordBagRefFunc(dispatch)
    }
}

function mapStateToProps(state=Map()) {
    return {
        loading: !state.get('cafesReturned'),
        returnedCafes: state.get('returnedCafes')
    }
}

export class QueryOutcome extends Component {

    componentDidMount() {
        this.props.getWordBagRef();
    }

    render() {
        return (
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
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryOutcome)

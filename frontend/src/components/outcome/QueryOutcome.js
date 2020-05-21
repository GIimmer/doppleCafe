import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import CafeMap from './CafeMap'
import CafePreviewList from './CafePreviewList'
import CafeDetailsWrapper from './CafeDetailsWrapper'
import { css } from "@emotion/core"
import RingLoader from "react-spinners/RingLoader"


const override = css`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
`;

function mapStateToProps(state=Map()) {
    return {
        loading: !state.get('similarCafesFound')
    }
}

export class QueryOutcome extends Component {

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
                            <CafePreviewList />
                            <CafeDetailsWrapper />
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default connect(mapStateToProps)(QueryOutcome)

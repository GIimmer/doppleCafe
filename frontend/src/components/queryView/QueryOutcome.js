import React, { Component } from 'react'
import CafeMap from '../reusable/CafeMap'
import CafePreviewList from '../reusable/CafePreviewList'
import CafeDetailsWrapper from '../reusable/CafeDetailsWrapper'
import QueryStore from '../../stores/QueryStore'
import { css } from "@emotion/core";
import RingLoader from "react-spinners/RingLoader";


const override = css`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
`;

export class QueryOutcome extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            queryState: QueryStore.getData('outcomeFilter')
        }
    }

    componentDidMount() {
        QueryStore.on("detailsUpdate", () => {
            let queryState = QueryStore.getData('outcomeFilter');

            this.setState({
                queryState: queryState,
                loading: !queryState.similarCafesFound
            })
        })
    }

    render() {
        return (
            <div id="QueryOutcome">
                {
                    this.state.queryState.similarCafesFound ?
                    <div className="cafePreviewHolder">
                        <CafeMap />
                        <div className="flexRowParent">
                            <CafePreviewList />
                            <CafeDetailsWrapper />
                        </div>
                    </div>
                    :
                    <RingLoader
                        css={override}
                        size={60}
                        color={"#123abc"}
                        loading={this.state.loading}
                    />
                }
            </div>
        )
    }
}

export default QueryOutcome

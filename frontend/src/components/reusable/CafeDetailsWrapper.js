import React, { PureComponent } from 'react'
import CafeDetails from './CafeDetails'
import ACTION_CONSTS from '../../constants/ActionConstants'
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


export class CafeDetailsWrapper extends PureComponent {
    constructor() {
        super();
        this.state = {
            loading: true,
            queryState: QueryStore.getData('outcomeFilter')
        }
    }

    componentDidMount() {
        QueryStore.on("detailsUpdate", () => {
            let queryState = QueryStore.getData('outcomeFilter'),
                loading = queryState.cafeDetails.state === ACTION_CONSTS.GETTING_CAFE_DETAILS;

            this.setState({
                queryState: queryState,
                loading: loading
            })
        })
    }

    render() {
        return (
            <div className="cafeDetailsWrapper">
                {
                    !this.state.loading ?
                    <CafeDetails />
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

export default CafeDetailsWrapper

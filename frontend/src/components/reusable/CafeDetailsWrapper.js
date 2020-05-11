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
            viewingCafe: null,
            queryState: QueryStore.getData('outcomeFilter')
        }
    }

    componentDidMount() {
        QueryStore.on("detailsUpdate", () => {
            let queryState = QueryStore.getData('outcomeFilter'),
                loading = queryState.cafeDetails.state === ACTION_CONSTS.GETTING_CAFE_DETAILS,
                viewingCafe = queryState.cafeDetails.cafeId ?
                    queryState.cafeDetails[queryState.cafeDetails.cafeId]
                    :
                    queryState.similarCafes.find((cafe) => cafe.placeId === queryState.cafeDetails.cafeId);
            if (viewingCafe.wordCloud === undefined) {
                viewingCafe.wordCloud = viewingCafe.rawWordCloud.map((tuple) => {
                    return { text: queryState.wordBagRef[tuple[0]], value: tuple[1] }
                })
            }

            this.setState({
                queryState: queryState,
                loading: loading,
                viewingCafe: viewingCafe
            })
        })
    }

    render() {
        return (
            <div className="cafeDetailsWrapper">
                {
                    !this.state.loading ?
                    <CafeDetails state={this.state.queryState.cafeDetails.state} cafe={this.state.viewingCafe}/>
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

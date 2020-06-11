import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import CafeDetails from './CafeDetails/CafeDetails'
import { GETTING_CAFE_DETAILS } from '../../constants/ActionConstants'
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

function mapStateToProps(state) {
    return {
        loading: state.getIn(['cafeDetails', 'state']) === GETTING_CAFE_DETAILS
    }
}


export class CafeDetailsWrapper extends PureComponent {

    render() {
        return (
            <div className="cafeDetailsWrapper">
                <CafeDetails />
                {
                    this.props.loading &&
                        <RingLoader
                            css={override}
                            size={60}
                            color={"#123abc"}
                        />
                }
            </div>
        )
    }
}

export default connect(mapStateToProps)(CafeDetailsWrapper)

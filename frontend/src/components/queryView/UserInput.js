import React, { Component } from 'react'
import CafeInput from './CafeInput'
import CityInput from './CityInput'
import MessageBox from './MessageBox'
import QueryStore from '../../stores/QueryStore'
import ResponseCard from '../reusable/ResponseCard'
import { optionLockToggled } from "../../actions/QueryActions";
import { css } from "@emotion/core";
import RingLoader from "react-spinners/RingLoader";
import ACTION_CONSTS from '../../constants/ActionConstants'


const override = css`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
`;

export class UserInput extends Component {
    _isMounted = true;

    constructor(props) {
        super(props);
        this.state = {
            field: props.field,
            queryState: QueryStore.getData(props.field)
        }
    }

    componentDidMount() {
        QueryStore.on(this.state.field + "Update", () => {
            this._isMounted && this.setState({
                queryState: QueryStore.getData(this.state.field)
            })
        })

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleClick(field, data, e) {
        e.preventDefault();
        if (data.locked !== false) {
            optionLockToggled(field === 'cafe', data);
        }
    }

    render() {
        let fieldOptions = this.state.queryState[this.state.field + 'Response'],
            smallResCard = fieldOptions.length > 1;
        const responseState = this.state.queryState[this.state.field + 'QueryState'],
            showLoading = [ACTION_CONSTS.GETTING_CAFE_OPTIONS, ACTION_CONSTS.GETTING_CITY_OPTIONS].includes(responseState);
            
        return (
            <div className="userInput">
                <MessageBox field={this.state.field} messageProp={this.state.field + 'Messages'} />
                {
                    this.state.field === 'cafe' ? <CafeInput /> : <CityInput />
                }
                <div className="responseCardHolder">
                    {
                        showLoading ?
                        <RingLoader
                            css={override}
                            size={60}
                            color={"#123abc"}
                            loading={this.state.loading}
                        />
                        :
                        fieldOptions.map((searchRes) => {
                            return <ResponseCard field={this.state.field} response={searchRes} displaySmall={smallResCard}
                                    handleClick={this.handleClick.bind(this, this.state.field, searchRes)} />
                        })
                    }
                </div>
                
            </div>
        )
    }
}

export default UserInput

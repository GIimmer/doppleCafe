import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Map, List } from 'immutable'
import CafeInput from './CafeInput'
import CityInput from './CityInput'
import MessageBox from './MessageBox'
import ResponseCard from './ResponseCard'
import { optionLockToggledFunc } from "../../../actions/queryActions";
import { css } from "@emotion/core";
import RingLoader from "react-spinners/RingLoader";
import { GETTING_CAFE_OPTIONS, GETTING_CITY_OPTIONS } from '../../../constants/ActionConstants'


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
        optionLockToggled: optionLockToggledFunc(dispatch)
    }
}

function mapStateToProps(state=Map()) {
    return {
        cafeResponse: state.get('cafeResponse'),
        cafeQueryState: state.get('cafeQueryState'),
        cityResponse: state.get('cityResponse'),
        cityQueryState: state.get('cityQueryState'),
        loading: state.get('loading')
    }
}

export class UserInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            field: props.field
        }
    }

    handleClick(field, data, e) {
        e.preventDefault();
        if (data.locked !== false) {
            this.props.optionLockToggled(field === 'cafe', data);
        }
    }

    render() {
        let fieldOptions = this.props[this.props.field + 'Response'],
            jsFieldOptions = List.isList(fieldOptions) ? fieldOptions.toJS() : fieldOptions,
            smallResCard = jsFieldOptions.length > 1;
        const responseState = this.props[this.props.field + 'QueryState'],
            showLoading = [GETTING_CAFE_OPTIONS, GETTING_CITY_OPTIONS].includes(responseState);
            
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
                            loading={showLoading}
                        />
                        :
                        jsFieldOptions.map((searchRes) => {
                            return <ResponseCard field={this.state.field} response={searchRes} displaySmall={smallResCard}
                                    handleClick={this.handleClick.bind(this, this.state.field, searchRes)} />
                        })
                    }
                </div>
                
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInput);

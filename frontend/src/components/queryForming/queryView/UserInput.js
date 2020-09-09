import React, { Component } from 'react'
import { connect } from 'react-redux'
import CafeInput from './CafeInput'
import CityInput from './CityInput'
import MessageBox from './MessageBox'
import ResponseCard from './ResponseCard'
import { optionLockToggledFunc } from "../../../actions/queryActions";
import { css } from "@emotion/core";
import RingLoader from "react-spinners/RingLoader";
import { GETTING_CITY_OPTIONS, CAFE_OPTION_SELECTED } from '../../../constants/ActionConstants'


const override = css`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
`;


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
        let cafeOrCityList = this.props.apiResponse ? this.props.apiResponse.toJS() : undefined,
            isCafe = this.props.field === 'cafe',
            multiplePossibleCities = !isCafe && cafeOrCityList.length > 1;
        const showLoading = [CAFE_OPTION_SELECTED, GETTING_CITY_OPTIONS].includes(this.props.queryState);
            
        return (
            <div className="userInput">
                <MessageBox field={this.state.field} messageProp={this.state.field + 'Messages'} />
                {
                    isCafe ? <CafeInput /> : <CityInput />
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
                        <>
                        {
                            isCafe && cafeOrCityList ?
                            <ResponseCard 
                                field={'cafe'}
                                response={cafeOrCityList}
                                displaySmall={false}
                                handleClick={this.handleClick.bind(this, 'cafe', cafeOrCityList)} />
                            :
                            cafeOrCityList && cafeOrCityList.map((city) => ( 
                                <ResponseCard
                                    key={city.id}
                                    field={'city'}
                                    response={city}
                                    displaySmall={multiplePossibleCities}
                                    handleClick={this.handleClick.bind(this, 'city', city)} />
                            ))
                        }
                        </>
                    }
                </div>
            </div>
        )
    }
}


function mapDispatchToProps(dispatch) {
    return {
        optionLockToggled: optionLockToggledFunc(dispatch)
    }
}

function mapStateToProps() {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInput);

import React from 'react'
import UserInput from "./UserInput";
import { connect } from 'react-redux';

export function QueryView(props) {
    return (
        <div id="inputsSection">
            <div  id="CafeSection" className="inputSection">
                <UserInput field="cafe" apiResponse={props.cafeResponse} queryState={props.cafeQueryState} />
            </div>
            <div id="CitySection" className="inputSection">
                <UserInput field="city" apiResponse={props.cityResponse} queryState={props.cityQueryState} />
            </div>
        </div>
    )
}

function mapStateToProps(state=Map()) {
    return {
        cafeResponse: state.get('cafeResponse'),
        cafeQueryState: state.get('cafeQueryState'),
        cityResponse: state.get('cityResponse'),
        cityQueryState: state.get('cityQueryState')
    }
}

export default connect(mapStateToProps)(QueryView);
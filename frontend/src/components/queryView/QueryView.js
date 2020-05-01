import React from 'react'
import UserInput from "./UserInput";

export default function QueryView() {
    return (
        <div id="inputsSection">
            <div  id="CafeSection" className="inputSection">
                <UserInput field="cafe" />
            </div>
            <div id="CitySection" className="inputSection">
                <UserInput field="city" />
            </div>
        </div>
    )
}


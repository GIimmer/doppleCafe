import React, { Component } from 'react';

import QueryStore from "../stores/QueryStore";
import UserInput from "./UserInput";
import QueryActions from "../actions/QueryActions";

export class QueryView extends Component {
    constructor() {
        super();
        this.state = {
            QueryState: QueryStore.getData()
        };
    }

    componentWillMount() {
        QueryStore.on("change", () => {
            this.setState({
                QueryState: QueryStore.getData()
            })
        })
    }

    render() {
        return (
            <div id="QueryView">
                <div id="CafeSection" className="inputSection">
                    <UserInput field="cafe"></UserInput>
                </div>
                <div id="CitySection" className="inputSection">
                    <UserInput field="city"></UserInput>
                </div>
                <div id="OutcomeSection">

                </div>
            </div>
        )
    }
}

export default QueryView

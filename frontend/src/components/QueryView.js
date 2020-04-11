import React, { Component } from 'react';

import QueryStore from "../stores/QueryStore";
import QueryActions from "../actions/QueryActions";

export class QueryView extends Component {
    constructor() {
        super();
        this.state = {
            QueryState: QueryStore.getAll()
        };
        console.log(this.state);
    }

    componentWillMount() {
        QueryStore.on("change", () => {
            this.setState({
                QueryState: QueryStore.getAll()
            })
        })
    }

    render() {
        return (
            <div>
                <p>{ this.state.QueryState.lastCityQuery }</p>
            </div>
        )
    }
}

export default QueryView

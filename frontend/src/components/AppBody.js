import React, { Component } from 'react';
import QueryView from './QueryView.js';
import ExploreView from './ExploreView';
import QueryStore from "../stores/QueryStore";
import CONSTS from "../constants/Constants";

export class AppBody extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            QueryState: {
                currentTab: CONSTS.QUERY_VIEW
            }
        };
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
                { 
                this.state.QueryState.currentTab === CONSTS.EXPLORE_VIEW ? 
                <ExploreView></ExploreView> :
                <QueryView></QueryView>} 
            </div>
        )
    }
}

export default AppBody

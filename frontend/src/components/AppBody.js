import React, { Component } from 'react';
import QueryStore from "../stores/QueryStore";
import { CONSTS } from "../constants/Constants";
import ViewingPane from "./reusable/ViewingPane";
import QueryView from "./queryView/QueryView";
import QueryOutcome from "./queryView/QueryOutcome";
import ExploreCities from "./exploreView/ExploreCities";
import ExploreCity from "./exploreView/ExploreCity";
import { CSSTransition } from "react-transition-group";

export class AppBody extends Component {
    constructor() {
        super();
        this.state = {
            queryState: QueryStore.getData()
        };
    }

    componentDidMount() {
        QueryStore.on("change", () => {
            this.setState({
                queryState: QueryStore.getData()
            })
        })
    }

    render() {
        return (
            <div id="AppBody">
                <ViewingPane />
                <CSSTransition
                in={!this.state.queryState.searchParamsSet}
                timeout={1000}
                classNames="fade"
                appear
                unmountOnExit>
                    {
                        this.state.queryState.currentTab === CONSTS.EXPLORE_VIEW ?
                        <ExploreCities />
                        :
                        <QueryView />
                    }
                </CSSTransition>
                {
                    this.state.queryState.searchParamsSet &&
                    <div id="OutcomeSection" className={this.state.queryState.searchParamsSet ? 'outcomeVisible' : ''}>
                        {
                            this.state.queryState.currentTab === CONSTS.EXPLORE_VIEW ?
                            <ExploreCity />
                            :
                            <QueryOutcome />
                        }
                    </div>
                }
            </div>
        )
    }
}

export default AppBody


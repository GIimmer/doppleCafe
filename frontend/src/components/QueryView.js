import React, { Component } from 'react';

import QueryStore from "../stores/QueryStore";
import UserInput from "./UserInput";
import ViewingPane from "./ViewingPane";
import { CSSTransition } from "react-transition-group";
import QueryActions from "../actions/QueryActions";

export class QueryView extends Component {
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
            <div id="queryView">
                <ViewingPane />
                <CSSTransition
                in={!this.state.queryState.searchParamsSet}
                timeout={1000}
                classNames="fade"
                appear>
                    <div id="inputsSection">
                        <div  id="CafeSection" className="inputSection">
                            <UserInput field="cafe" />
                        </div>
                        <div id="CitySection" className="inputSection">
                            <UserInput field="city" />
                        </div>
                    </div>
                </CSSTransition>
                <CSSTransition
                in={this.state.queryState.searchParamsSet}
                timeout={1000}
                classNames="slideFromRight"
                appear>
                    <div id="outcomeSection"></div>
                </CSSTransition>
            </div>
        )
    }
}

export default QueryView

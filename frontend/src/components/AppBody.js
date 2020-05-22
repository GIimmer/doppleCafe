import React, { Component } from 'react';
import { connect } from "react-redux";
import { CONSTS } from "../constants/Constants";
import ViewingPane from "./shared/ViewingPane";
import QueryView from "./queryForming/queryView/QueryView";
import QueryOutcome from "./outcome/QueryOutcome";
import ExploreCities from "./queryForming/exploreView/ExploreCities";
import { CSSTransition } from "react-transition-group";

function mapStateToProps(state=Map()) {
    return {
        searchParamsSet: state.get('searchParamsSet'),
        currentTab: state.get('currentTab')
    }
}

export class AppBody extends Component {

    render() {
        return (
            <div id="AppBody">
                <ViewingPane />
                <CSSTransition
                in={!this.props.searchParamsSet}
                timeout={1000}
                classNames="fade"
                appear
                unmountOnExit>
                    {
                        this.props.currentTab === CONSTS.EXPLORE_VIEW ?
                        <ExploreCities />
                        :
                        <QueryView />
                    }
                </CSSTransition>
                {
                    this.props.searchParamsSet &&
                    <div id="OutcomeSection" className="outcomeVisible">
                        <QueryOutcome />
                    </div>
                }
            </div>
        )
    }
}

export default connect(mapStateToProps)(AppBody)


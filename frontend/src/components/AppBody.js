import React, { Component } from 'react';
import { connect } from "react-redux";
import { CONSTS } from "../constants/Constants";
import ViewingPane from "./shared/ViewingPane";
import QueryView from "./queryForming/queryView/QueryView";
import QueryOutcome from "./outcome/QueryOutcome";
import ExploreCities from "./queryForming/exploreView/ExploreCities";
import { CSSTransition } from "react-transition-group";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function mapStateToProps(state=Map()) {
    return {
        searchParamsSet: state.get('searchParamsSet'),
    }
}

export class AppBody extends Component {

    render() {
        return (
            <div id="AppBody">
                <ViewingPane />
                <Switch>
                    <Route path={['/', `/${CONSTS.QUERY_VIEW}`]} exact component={QueryView} />
                    <Route path={`/${CONSTS.EXPLORE_VIEW}`} exact component={ExploreCities} />
                    <Route path={`/${CONSTS.QUERY_OUTCOME_VIEW}`} component={QueryOutcome} />
                    <Route path={`/${CONSTS.EXPLORE_OUTCOME_VIEW}`} component={QueryOutcome} />
                </Switch>
            </div>
        )
    }
}

export default connect(mapStateToProps)(AppBody)


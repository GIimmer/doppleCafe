import React, { Component, Suspense, lazy } from 'react'
import { connect } from "react-redux"
import { CONSTS } from "../constants/Constants"
import { getPreLoadedCitiesFunc } from "../actions/queryActions"
import ViewingPane from "./shared/ViewingPane"
import QueryView from "./queryForming/queryView/QueryView"
import QueryOutcome from "./outcome/QueryOutcome"
import ExploreCities from "./queryForming/exploreView/ExploreCities"
import { Switch, Route, Redirect } from 'react-router-dom'

const AboutView = lazy(() => import("./about/AboutView"));

export class AppBody extends Component {

    componentDidMount() {
        this.props.getPreLoadedCities();
    }

    render() {
        return (
            <div id="AppBody">
                <ViewingPane />
                <Switch>
                    <Route exact path="/">
                        <Redirect to={`/${CONSTS.QUERY_VIEW}`} />
                    </Route> 
                    <Route path={`/${CONSTS.QUERY_VIEW}`} exact component={QueryView} />
                    <Route path={`/${CONSTS.EXPLORE_VIEW}`} exact component={ExploreCities} />
                    <Route path={`/${CONSTS.QUERY_OUTCOME_VIEW}`} component={QueryOutcome} />
                    <Route path={`/${CONSTS.EXPLORE_OUTCOME_VIEW}`} component={QueryOutcome} />
                    <Suspense fallback={<h2 style={{ color: 'grey', position: 'absolute', top: '7vh'}}>Loading...</h2>}>
                        <Route path={`/${CONSTS.ABOUT_VIEW}`} component={AboutView} />
                    </Suspense>
                </Switch>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getPreLoadedCities: getPreLoadedCitiesFunc(dispatch)
    }
}

export default connect(() => ({}), mapDispatchToProps)(AppBody)


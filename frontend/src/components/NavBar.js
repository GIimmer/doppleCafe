import React from 'react'
import { connect } from 'react-redux'
import { useAuth0 } from "@auth0/auth0-react";
import { AppBar, Tabs, Tab, Button, Typography } from '@material-ui/core'
import '../styles/styles.scss'
import CONSTS from "../constants/Constants"
import { Link } from 'react-router-dom'
import { withRouter } from "react-router";
import { tabSwitchedFunc } from "../actions/stateActions";

const TABVALUEMAP = {
    [CONSTS.QUERY_VIEW]: 0,
    [CONSTS.QUERY_OUTCOME_VIEW]: 0,
    [CONSTS.EXPLORE_VIEW]: 1,
    [CONSTS.EXPLORE_OUTCOME_VIEW]: 1,
    [CONSTS.ABOUT_VIEW]: 2
}

export const NavBar = (props) => {
    const tabValue = TABVALUEMAP[props.location];
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

    return (
        <div id="NavBar">
            <AppBar position="static" className="AppBar">
                <Tabs value={tabValue} className="tabs" onChange={props.tabSwitched} aria-label="Navbar tabs">
                    <Tab label="Find a Matching Cafe" component={Link} to={`/${CONSTS.QUERY_VIEW}`} />
                    <Tab label="View Cafes by City" component={Link} to={`/${CONSTS.EXPLORE_VIEW}`} />
                    <Tab label="About + FAQs" component={Link} to={`/${CONSTS.ABOUT_VIEW}`} />
                </Tabs>
                <Typography variant="h4" className="title">
                    CAFE FINDER
                </Typography>
                {
                    !isAuthenticated ?
                    <Button color="inherit" onClick={() => loginWithRedirect()} className={'loginButton'}>Login</Button>
                    :
                    <Button color="inherit" onClick={() => logout()} className={'loginButton'}>Logout</Button>
                }
            </AppBar>
        </div>
    )
}

const mapStateToProps = (state, props) => {
    return {
        location: props.location.pathname.replace(/\\|\//g,'')
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        tabSwitched: tabSwitchedFunc(dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar))
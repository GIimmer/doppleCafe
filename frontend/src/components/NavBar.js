import React from 'react'
import { connect } from 'react-redux'
import { useAuth0 } from "@auth0/auth0-react";
import { AppBar, Tabs, Tab, Button } from '@material-ui/core'
import '../styles/styles.scss'
import CONSTS from "../constants/Constants"
import { Link } from 'react-router-dom'
import { withRouter } from "react-router";
import { tabSwitchedFunc } from "../actions/stateActions";

export const NavBar = (props) => {
    const tabValue = [`/${CONSTS.QUERY_VIEW}`, `/${CONSTS.QUERY_OUTCOME_VIEW}`].includes(props.location) ? 0 : 1;
    const { isAuthenticated, loginWithRedirect, user, error, logout } = useAuth0();
    console.log("Is authenticated? ", isAuthenticated);
    console.log('here is the user: ', user);
    console.log('here is the error: ', error);

    return (
        <div id="NavBar">
            <AppBar position="static" className="AppBar">
                <Tabs value={tabValue} className="tabs" onChange={props.tabSwitched} aria-label="Navbar tabs">
                    <Tab label="Find a Matching Cafe" component={Link} to={`/${CONSTS.QUERY_VIEW}`} />
                    <Tab label="View Cafes by City" component={Link} to={`/${CONSTS.EXPLORE_VIEW}`} />
                </Tabs>
                {
                    !isAuthenticated ?
                    <Button color="inherit" onClick={() => loginWithRedirect()} className={'loginButton'}>Login</Button>
                    :
                    <Button color="inherit" className={'loginButton'}>Logout</Button>
                }
            </AppBar>
        </div>
    )
}

const mapStateToProps = (state, props) => {
    return {
        location: props.location.pathname
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        tabSwitched: tabSwitchedFunc(dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar))
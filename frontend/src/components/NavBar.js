import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppBar, Tabs, Tab, Button } from '@material-ui/core'
import '../styles/styles.scss'
import CONSTS from "../constants/Constants"
import { Link } from 'react-router-dom'
import { withRouter } from "react-router";
import { tabSwitchedFunc } from "../actions/stateActions";

function mapStateToProps(state) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return {
        tabSwitched: tabSwitchedFunc(dispatch)
    }
}

export class NavBar extends Component {
    constructor() {
        super();
        this.state = {
            QueryState: {}
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            let location = this.props.location.pathname.substr(1);
            if ([CONSTS.QUERY_VIEW, CONSTS.EXPLORE_VIEW].includes(location)) {
                this.props.tabSwitched();
            }
        }
      }

    render() {
        let tabValue = [`/${CONSTS.QUERY_VIEW}`, `/${CONSTS.QUERY_OUTCOME_VIEW}`].includes(this.props.location.pathname) ? 0 : 1;
        return (
            <div id="NavBar">
                <AppBar position="static" className="AppBar">
                    <Tabs value={tabValue} className="tabs" aria-label="Navbar tabs">
                        <Tab label="Find a Matching Cafe" component={Link} to={`/${CONSTS.QUERY_VIEW}`} />
                        <Tab label="View Cafes by City" component={Link} to={`/${CONSTS.EXPLORE_VIEW}`} />
                    </Tabs>
                    <Button color="inherit" className={'loginButton'}>Login</Button>
                </AppBar>
            </div>
        )
    }
}

const NavBarWithRouter = withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar))

export default NavBarWithRouter

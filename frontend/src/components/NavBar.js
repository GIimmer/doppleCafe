import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppBar, Tabs, Tab, Button } from '@material-ui/core'
import '../styles/styles.scss'
import CONSTS from "../constants/Constants"

import { tabSwitchedFunc } from "../actions/stateActions";

function mapStateToProps(state) {
    return {
        value: state.get('currentTab') === CONSTS.QUERY_VIEW ? 0 : 1
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

    handleChange(e, newValue) {
        this.props.tabSwitched(newValue === 0 ? CONSTS.QUERY_VIEW : CONSTS.EXPLORE_VIEW);
    }

    render() {
        return (
            <div id="NavBar">
                <AppBar position="static" className="AppBar">
                    <Tabs value={this.props.value} className="tabs" onChange={this.handleChange.bind(this)} aria-label="simple tabs example">
                        <Tab label="Find a Matching Cafe" id={CONSTS.QUERY_VIEW}/>
                        <Tab label="View Cafes by City" id={CONSTS.EXPLORE_VIEW}/>
                    </Tabs>
                    <Button color="inherit" className={'loginButton'}>Login</Button>
                </AppBar>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)

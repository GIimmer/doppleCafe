import React, { Component } from 'react';
import { AppBar, Tabs, Tab, Button } from '@material-ui/core'
import '../styles/styles.scss';
import CONSTS from "../constants/Constants";


import QueryStore from "../stores/QueryStore";
import { tabSwitched } from "../actions/QueryActions";

export class NavBar extends Component {
    constructor() {
        super();
        this.state = {
            value: 0,
            QueryState: {}
        }
    }

    handleChange(e, newValue) {
        tabSwitched(newValue === 0 ? CONSTS.QUERY_VIEW : CONSTS.EXPLORE_VIEW);
    }

    componentWillMount() {
        QueryStore.on("change", () => {
            this.setState({
                QueryState: QueryStore.getData()
            })
            this.setState({
                value: this.state.QueryState.currentTab === CONSTS.QUERY_VIEW ? 0 : 1
            })
        })
    }

    render() {
        return (
            <div id="NavBar">
                <AppBar position="static" className={'AppBar'}>
                    <Tabs value={this.state.value} className={'tabs'} onChange={this.handleChange} aria-label="simple tabs example">
                        <Tab label="Find a Matching Cafe" id={CONSTS.QUERY_VIEW}/>
                        <Tab label="View Cafes by City" id={CONSTS.EXPLORE_VIEW}/>
                    </Tabs>
                    <Button color="inherit" className={'loginButton'}>Login</Button>
                </AppBar>
            </div>
        )
    }
}

export default NavBar

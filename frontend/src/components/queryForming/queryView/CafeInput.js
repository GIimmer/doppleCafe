import React, { Component } from 'react'
import { connect } from 'react-redux'
import { searchForCafeFunc } from "../../../actions/queryActions";
import TextField from '@material-ui/core/TextField'


function mapDispatchToProps(dispatch) {
    return {
        searchForCafe: searchForCafeFunc(dispatch)
    }
}

export class CafeInput extends Component {

    handleSubmit(e) {
        e.preventDefault();
        let cafeQuery = e.target[0].value;
        this.props.searchForCafe(cafeQuery);
    }

    render() {
        return (
            <div className="margin50">
                <form autoComplete="off" style={{ textAlign: 'center', marginTop: 16, marginBottom: 8 }} onSubmit={this.handleSubmit.bind(this)}>
                    <TextField label="Search for a cafe you know you like" style={{display: 'inline-block'}} variant="outlined" fullWidth />
                </form>
            </div>
        )
    }
}

export default connect(() => ({}), mapDispatchToProps)(CafeInput);

import React, { Component } from 'react'
import { searchForCafe } from "../../actions/QueryActions";
import TextField from '@material-ui/core/TextField'


const STYLE = {
    display: 'inline-block'
}

export class CafeInput extends Component {

    handleSubmit(e) {
        e.preventDefault();
        let cafeQuery = e.target[0].value;
        searchForCafe(cafeQuery);
    }

    render() {
        return (
            <div className="margin50">
                <form autoComplete="off" style={{ textAlign: 'center', marginTop: 16, marginBottom: 8 }} onSubmit={this.handleSubmit}>
                    <TextField label="Target cafe" style={STYLE} onChange={this.handleChange} variant="outlined" required fullWidth />
                </form>
            </div>
        )
    }
}

export default CafeInput

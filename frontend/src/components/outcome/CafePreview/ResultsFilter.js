import React from 'react'
import { connect } from 'react-redux'
import { ThemeProvider } from '@material-ui/styles'
import { darkTheme } from '../../../styles/muiTheme'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TermFilterSection from './TermFilterSection'
import { toggleHighlightRWFriendlyFunc } from '../../../actions/outcomeActions'

export function ResultsFilter(props) {
    const isChecked = props.highlightRWFriendly;
    return (
        <ThemeProvider theme={darkTheme}>
            <div className="resultsFilter">
                <div className="remoteWorkerFilter">
                    <FormControlLabel
                        control={
                            <Switch 
                                size="large" 
                                checked={isChecked}
                                onChange={() => props.toggleHighlightRWFriendly(!isChecked)} 
                            />}
                        label="Highlight remote worker friendly cafes?"
                        labelPlacement="top"
                    />
                </div>
                <TermFilterSection />
            </div>
        </ThemeProvider>
    )
}

function mapStateToProps(state) {
    return {
        highlightRWFriendly: state.get('highlightRWFriendly')
    }
};

function mapDispatchToProps(dispatch) {
    return {
        toggleHighlightRWFriendly: toggleHighlightRWFriendlyFunc(dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultsFilter)

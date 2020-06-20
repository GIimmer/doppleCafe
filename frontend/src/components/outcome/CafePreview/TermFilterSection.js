import React, { Component } from 'react'
import { connect } from 'react-redux'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip'
import { setTermFilterFunc, removeTermFilterFunc } from '../../../actions/outcomeActions'


export class TermFilterSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterOptions: props.weightedTerms
        }
    }

    filterByTerm(term) {
        console.log('term is: ', term);
    }

    render() {
        return (
            <div className="termFilterSection">
                <Autocomplete
                    id="filterBy"
                    autoHighlight
                    options={this.state.filterOptions.sort((a, b) => a > b )}
                    onChange={(e, val) => this.props.setTermFilter(val)}
                    renderInput={(params) => (
                        <TextField {...params} label="Add term filter" margin="normal" variant="outlined" />
                    )}
                />
                <div className="filterChipsSection">
                        {
                            this.props.filteringBy &&
                            this.props.filteringBy.map(term => {
                                return <Chip
                                        label={term}
                                        onDelete={() => this.props.removeTermFilter(term)}
                                        style={{ margin: '5px 10px 5px 0px' }}
                                    />
                            })
                        }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    weightedTerms: state.get('weightedTerms'),
    filteringBy: state.get('filteringByTerms')
})

function mapDispatchToProps(dispatch) {
    return {
        setTermFilter: setTermFilterFunc(dispatch),
        removeTermFilter: removeTermFilterFunc(dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TermFilterSection)

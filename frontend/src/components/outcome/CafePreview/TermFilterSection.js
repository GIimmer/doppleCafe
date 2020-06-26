import React, { Component } from 'react'
import { connect } from 'react-redux'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip'
import { setTermFilterFunc, removeTermFilterFunc, clearAllTermFiltersFunc } from '../../../actions/outcomeActions'


export class TermFilterSection extends Component {
    cafeTerms;
    constructor(props) {
        super(props);
        this.state = {
            cafeTerms: []
        }
    }

    getFilterOptions(termToCafesMap) {
        if (termToCafesMap && !this.state.cafeTerms.length) {
            const validFiltersMap = termToCafesMap.filter(value => !!value.size);
            let [ ...cafeTerms] = validFiltersMap.keys();
            cafeTerms.sort((a, b) => a > b );
            this.state.cafeTerms = cafeTerms;
        }
        return this.state.cafeTerms;
    }

    render() {
        let filterOptions = this.getFilterOptions(this.props.termToCafesMap);
        return (
            <div className="termFilterSection">
                <Autocomplete
                    id="filterBy"
                    autoHighlight
                    clearOnBlur="true"
                    options={filterOptions}
                    onChange={(e, val) => val && this.props.setTermFilter(val)}
                    renderInput={(params) => (
                        <TextField {...params} label="Add term filter" margin="normal" variant="outlined" />
                    )}
                />
                <div className="filterChipsSection">
                    {
                        this.props.filteringBy.size > 1 &&
                        <Chip label="CLEAR ALL" onClick={() => this.props.clearAllTermFilters()} variant="outlined" />
                    }
                    {
                        this.props.filteringBy.map(term => {
                            return <Chip
                                        key={term + '_chip'}
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

function mapStateToProps(state) {
    const cafeFilter = state.get('cafeFilter');
    return {
        termToCafesMap: state.get('termToCafesMap'),
        filteringBy: state.get('filteringByTerms'),
        cafeFilter: cafeFilter ? cafeFilter.toJS() : null,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setTermFilter: setTermFilterFunc(dispatch),
        removeTermFilter: removeTermFilterFunc(dispatch),
        clearAllTermFilters: clearAllTermFiltersFunc(dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TermFilterSection)

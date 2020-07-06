import React, { useState } from 'react'
import { connect } from 'react-redux'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip'
import { setTermFilterFunc, removeTermFilterFunc, clearAllTermFiltersFunc } from '../../../actions/outcomeActions'


function getFilterOptions(termToCafesMap) {
    if (termToCafesMap) {
        const validFiltersMap = termToCafesMap.filter(value => !!value.size);
        let [ ...cafeTerms] = validFiltersMap.keys();
        return cafeTerms.sort((a, b) => a > b );
    }
}

export function TermFilterSection(props) {
    const [filterOptions, setFilterOptions] = useState(null);
    if (!filterOptions && props.termToCafesMap) {
        setFilterOptions(getFilterOptions(props.termToCafesMap));
    }
    return (
        <div className="termFilterSection">
            {
                filterOptions && 
                <Autocomplete
                    id="filterBy"
                    autoHighlight
                    clearOnBlur={true}
                    options={filterOptions}
                    onChange={(_, val) => val && props.setTermFilter(val)}
                    renderInput={(params) => (
                        <TextField {...params} label="Add term filter" margin="normal" variant="outlined" />
                    )}
                />
            }
            <div className="filterChipsSection">
                {
                    props.filteringBy.size > 1 &&
                    <Chip label="CLEAR ALL" onClick={() => props.clearAllTermFilters()} variant="outlined" />
                }
                {
                    props.filteringBy.map(term => {
                        return <Chip
                                    key={term + '_chip'}
                                    label={term}
                                    onDelete={() => props.removeTermFilter(term)}
                                    style={{ margin: '5px 10px 5px 0px' }}
                                />
                    })
                }
            </div>
        </div>
    )
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

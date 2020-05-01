import React, { Component } from 'react'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField';
import QueryStore from '../../stores/QueryStore'
import { optionLockToggled, searchForCity } from "../../actions/QueryActions";

const filter = createFilterOptions();

export class CityInput extends Component {
    _isMounted = true;

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            value: null,
            handleClick: props.handleClick,
            queryState: QueryStore.getData('city')
        }
    }

    handleSearchRequest(requestObj) {
        if (requestObj && requestObj.inputValue) {
            searchForCity(requestObj.inputValue);
        } else {
            optionLockToggled(false, requestObj);
        }
    }

    componentDidMount() {
        QueryStore.on('cityUpdate', () => {
            this._isMounted && this.setState({
                queryState: QueryStore.getData('city')
            })
        })
        this.setState({
            loaded: true
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div className="margin50">
                {
                    this.state.loaded && 
                    <Autocomplete
                        id="citySearch"
                        value={this.state.value}
                        autoHighlight
                        options={this.state.queryState.preLoadedCities.sort((a, b) => { return a.name > b.name })}
                        getOptionDisabled={(option) => option.inputValue !== undefined && !this.state.queryState.userCanLoadNewCity }
                        onChange={(e, newValue) => {
                            if (!newValue) return;

                            this.handleSearchRequest(newValue);
                          }}
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params);
                    
                            if (params.inputValue !== '') {
                              filtered.push({
                                inputValue: params.inputValue,
                                name: `Search for "${params.inputValue}"`,
                                country: 'N/A'
                              });
                            }
                    
                            return filtered;
                          }}
                        groupBy={(option) => { return option.country }}
                        getOptionLabel={(option) => {
                            if (typeof option === 'string') {
                                return option;
                              }
                              if (option.inputValue) {
                                return option.name;
                              }
                            return option.name
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Search for the city you're travelling to" margin="normal" variant="outlined" />
                        )}
                    />
                }
            </div>
        )
    }
}

export default CityInput

import React, { Component } from 'react'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField';
import QueryStore from '../../stores/QueryStore'
import { searchForCity, selectPreLoadedCity } from "../../actions/QueryActions";

const filter = createFilterOptions();

export class CityInput extends Component {
    _isMounted = true;

    constructor(props) {
        super(props);
        this.state = {
            value: null,
            handleClick: props.handleClick,
            queryState: QueryStore.getData('city')
        }
        this.state.preparedCityOptions = this.prepareCityOptions(this.state.queryState.preLoadedCities);
    }

    handleSearchRequest(requestObj) {
        if (requestObj && requestObj.inputValue) {
            searchForCity(requestObj.inputValue);
        } else {
            selectPreLoadedCity(requestObj);
        }
    }

    prepareCityOptions(cityOptions) {
        if (this.state.preparedCityOptions !== undefined) { return; }

        let comparator = {};
        return cityOptions.filter((city) => {
            let priorRef = comparator[city.name];

            if (priorRef === undefined) {
                priorRef = comparator[city.name] = [];
            }

            if (priorRef.length && priorRef.includes(city.country)) {
                return false;
            } else {
                priorRef.push(city.country);
                return true;
            }
        })
    } 

    componentDidMount() {
        QueryStore.on('cityUpdate', () => {
            this._isMounted && this.setState({
                queryState: QueryStore.getData('city')
            })
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div className="margin50">
                <Autocomplete
                    id="citySearch"
                    value={this.state.value}
                    autoHighlight
                    options={this.state.preparedCityOptions.sort((a, b) => { return a.name > b.name })}
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
            </div>
        )
    }
}

export default CityInput

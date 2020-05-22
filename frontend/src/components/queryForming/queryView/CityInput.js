import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField';
import { searchForCityFunc, selectPreLoadedCityFunc } from "../../../actions/queryActions";

function mapDispatchToProps(dispatch) {
    return {
        searchForCity: searchForCityFunc(dispatch),
        selectPreLoadedCity: selectPreLoadedCityFunc(dispatch)
    }
}

function mapStateToProps(state=Map()) {
    return {
        preLoadedCities: state.get('preLoadedCities'),
        userCanLoadNewCity: state.get('userCanLoadNewCity')
    }
}

const filter = createFilterOptions();

export class CityInput extends Component {
    _isMounted = true;

    constructor(props) {
        super(props);
        this.state = {
            value: null,
            handleClick: props.handleClick
        }
        this.state.preparedCityOptions = this.prepareCityOptions(this.props.preLoadedCities.toJS());
    }

    handleSearchRequest(requestObj) {
        if (requestObj && requestObj.inputValue) {
            this.props.searchForCity(requestObj.inputValue);
        } else {
            this.props.selectPreLoadedCity(requestObj);
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
                    getOptionDisabled={(option) => option.inputValue !== undefined && !this.props.userCanLoadNewCity }
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

export default connect(mapStateToProps, mapDispatchToProps)(CityInput)

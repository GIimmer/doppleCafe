import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { useAuth0 } from '@auth0/auth0-react'
import { CONSTS } from '../../../constants/Constants'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField';
import { searchForCityFunc, selectPreLoadedCityFunc } from "../../../actions/queryActions"
import { useToasts } from 'react-toast-notifications'


const filter = createFilterOptions();

function getcityInputFunc({ searchForCity, selectPreLoadedCity, ...rest }, getAccessTokenSilently, addToast) {
    return (e, requestObj) => {
        e.preventDefault();
        if (requestObj) {
            if (requestObj.inputValue) {
                addToast(
                <p style={{ fontSize: '1.2em' }}>Loading a new city can take in excess of 60 seconds</p>,
                { appearance: 'warning' });
                searchForCity(requestObj.inputValue, getAccessTokenSilently);
            } else {
                selectPreLoadedCity(requestObj);
            }
        }
    }
}

function prepareCityOptions(cityOptions) {
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

function usePermissions(isAuthenticated, getIdTokenClaims) {
    const [permission, setPermission] = useState(null);
    
    useEffect(() => {
        (async () => {
            if (isAuthenticated) {
                try {
                    const claims = await getIdTokenClaims();
                    const authLoc = CONSTS.DOMAIN_BASE + 'user_auth';
                    const permissions = claims && claims[authLoc] && claims[authLoc]['permissions'];
                    setPermission((permissions || [])[0]);
                } catch(err) {
                    console.error(err);
                }
            } else {
                return null;
            }
        })()
    })
    return permission;
}

function getCantLoadCityText(user, permission) {
    if (!user) {
        return 'Log in to load a new city';
    } else if (!user.email_verified) {
        return 'Verify email to load a new city';
    } else if (permission !== 'create:city') {
        return 'City loading permissions exhausted';
    }
    return null;
}

export function CityInput(props) {
    const { user, isAuthenticated, getIdTokenClaims, getAccessTokenSilently } = useAuth0();
    const permission = usePermissions(isAuthenticated, getIdTokenClaims),
        unPermittedUserText = getCantLoadCityText(user, permission);
    const { addToast } = useToasts()

    const [cityOptions, setCityOptions] = useState([]);
    if (!cityOptions.length && props.preLoadedCities.size) {
        setCityOptions(prepareCityOptions(props.preLoadedCities.toJS()));
    }

    return (
        <div className="margin50">
            {
                cityOptions &&
                <Autocomplete
                    id="citySearch"
                    autoHighlight
                    options={cityOptions.sort((a, b) => { return a.name > b.name })}
                    getOptionDisabled={(option) => option.inputValue !== undefined && !!unPermittedUserText }
                    onChange={getcityInputFunc(props, getAccessTokenSilently, addToast)}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);
                
                        if (params.inputValue !== '') {
                            filtered.push({
                                inputValue: params.inputValue,
                                name: unPermittedUserText ? `${unPermittedUserText}` : `Search for "${params.inputValue}"`,
                                country: 'N/A'
                            });
                        }
                
                        return filtered;
                        }}
                    groupBy={(option) => { return option.country }}
                    getOptionLabel={(option) => {
                        if (typeof option === 'string') {
                            return option;
                        } else if(option.inputValue) {
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

export default connect(mapStateToProps, mapDispatchToProps)(CityInput)

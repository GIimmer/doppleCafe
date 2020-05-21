import React, { Component } from 'react'
import { connect } from 'react-redux'
import ViewingBox from "./ViewingBox"
import Button from '@material-ui/core/Button'
import { genGooglePlacePhoto } from "../../utilities/utilities"
import { findMostSimilarFunc, clearSearchFunc } from '../../actions/stateActions'


function mapDispatchToProps(dispatch) {
    return {
        clearSearch: clearSearchFunc(dispatch),
        findMostSimilar: findMostSimilarFunc(dispatch)
    }
}

function mapStateToProps(state=Map()) {
    const baseMap = {
        cafeLock: state.get('cafeLock'),
        cityLock: state.get('cityLock'),
        searchParamsSet: state.get('searchParamsSet')
    }
    return Object.assign(baseMap, {
        searchParamsLocked: (!!baseMap.cafeLock.size && !!baseMap.cityLock.size)
    })
}


export class ViewingPane extends Component {

    getContainerClass() {
        let baseClass = 'viewingPane';
        if (this.props.searchParamsLocked) {
            baseClass += ' paneMounted';
        }
        if (this.props.searchParamsSet) {
            baseClass += ' paneActive'
        }
        return baseClass;
    }

    render() {
        let cafe = this.props.cafeLock, city = this.props.cityLock;
        if (this.props.searchParamsLocked) {
            cafe = cafe.size ? cafe.toJS() : cafe;
            city = city.size ? city.toJS() : city;
        }
        return (
            <div className={this.getContainerClass()}>
                {
                    this.props.searchParamsSet ?
                    <div className="selectionsHolder">
                        <Button id="cancelButton" 
                        variant="contained" 
                        color="secondary" 
                        size="small"
                        onClick={this.props.clearSearch}>
                            Cancel Search
                        </Button>
                        <ViewingBox field="cafe" photo={genGooglePlacePhoto(cafe.photo)} title={cafe.name} subtitle={cafe.formattedAddress} />
                        <ViewingBox field="city" photo={city.photo.src} title={city.name} subtitle={city.country} />
                    </div>
                    :
                    <div className="selectionsHolder">
                        <Button color="primary" onClick={this.props.findMostSimilar.bind(this, city, cafe)}>Search?</Button>
                    </div>
                }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewingPane)

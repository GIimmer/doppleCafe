import React, { Component } from 'react'
import QueryStore from "../../stores/QueryStore"
import ViewingBox from "./ViewingBox"
import Button from '@material-ui/core/Button'
import { isEmpty, genGooglePlacePhoto } from "../../utilities/utilities"
import { findMostSimilarWithCurrentParams, clearSearch } from "../../actions/QueryActions";

export class ViewingPane extends Component {
    constructor() {
        super();
        this.state = {
            mountPane: false,
            queryState: QueryStore.getData()
        };
    }

    componentDidMount() {
        QueryStore.on("change", () => {
            let queryState = QueryStore.getData(),
                searchParamsLocked = !isEmpty(this.state.queryState.cafeLock) && !isEmpty(this.state.queryState.cityLock);
            
            this.setState({
                queryState: queryState,
                searchParamsLocked: searchParamsLocked
            })
        })
    }

    getContainerClass() {
        let baseClass = 'viewingPane';
        if (this.state.searchParamsLocked) {
            baseClass += ' paneMounted';
        }
        if (this.state.queryState.searchParamsSet) {
            baseClass += ' paneActive'
        }
        return baseClass;
    }

    handleClick(action, e) {
        e.preventDefault();
        action === 'search' ? 
        findMostSimilarWithCurrentParams(this.state.queryState.cityLock, this.state.queryState.cafeLock) 
        :
        clearSearch();
    }

    onExit(e) {
        setTimeout(() => {
            this.setState({
                mountPane: false
            })
        }, 1000)
    }

    render() {
        let cafe, city;
        if (this.state.queryState.searchParamsSet) {
            cafe = this.state.queryState.cafeLock;
            city = this.state.queryState.cityLock;
        }
        return (
            <div className={this.getContainerClass()}>
                {
                    this.state.queryState.searchParamsSet ?
                    <div className="selectionsHolder">
                        <Button id="cancelButton" 
                        variant="contained" 
                        color="secondary" 
                        size="small"
                        onClick={this.handleClick.bind(this, 'cancel')}>
                            Cancel Search
                        </Button>
                        <ViewingBox field="cafe" photo={genGooglePlacePhoto(cafe.photo)} title={cafe.name} subtitle={cafe.formattedAddress} />
                        <ViewingBox field="city" photo={city.photo.src} title={city.name} subtitle={city.country} />
                    </div>
                    :
                    <div className="selectionsHolder">
                        <Button color="primary" onClick={this.handleClick.bind(this, 'search')}>Search?</Button>
                    </div>
                }
            </div>
        )
    }
}

export default ViewingPane

import React, { Component } from 'react'
import QueryStore from "../stores/QueryStore";
import ViewingBox from "./ViewingBox";
import Button from '@material-ui/core/Button';
import { isEmpty } from "../utilities/utilities";
import { findMostSimilarWithCurrentParams, clearSearch } from "../actions/QueryActions";

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

    handleSearch(e) {
        e.preventDefault();
        findMostSimilarWithCurrentParams();
    }

    handleCancel(e) {
        e.preventDefault();
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
                    <div class="selectionsHolder">
                        <Button id="cancelButton" 
                        variant="contained" 
                        color="secondary" 
                        size="small"
                        onClick={this.handleCancel}>
                            Cancel Search
                        </Button>
                        <ViewingBox field="cafe" photo={cafe.photos[0]} title={cafe.name} subtitle={cafe.formattedAddr} />
                        <ViewingBox field="city" photo={city.photos[0]} title={city.name} subtitle={city.country} />
                    </div>
                    :
                    <div className="selectionsHolder">
                        <Button color="primary" onClick={this.handleSearch}>Search?</Button>
                    </div>
                }
            </div>
        )
    }
}

export default ViewingPane

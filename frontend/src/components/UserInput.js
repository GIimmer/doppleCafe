import React, { Component } from 'react'
import CafeInput from './CafeInput'
import CityInput from './CityInput'
import MessageBox from './MessageBox'
import QueryStore from '../stores/QueryStore'
import ResponseCard from './ResponseCard'
import { optionLockToggled } from "../actions/QueryActions";

export class UserInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            field: props.field,
            queryState: QueryStore.getData(props.field)
        }
    }

    componentDidMount() {
        QueryStore.on(this.state.field + "Update", () => {
            this.setState({
                queryState: QueryStore.getData(this.state.field)
            })
        })
    }

    handleClick(field, data, e) {
        e.preventDefault();
        if (data.locked !== false) {
            optionLockToggled(field === 'cafe', data);
        }
    }

    render() {
        return (
            <div className="userInput">
                <MessageBox field={this.state.field} messageProp={this.state.field + 'Messages'} />
                {
                    this.state.field === 'cafe' ? <CafeInput /> : <CityInput />
                }
                <div className="responseCardHolder">
                    {
                        this.state.queryState[this.state.field + 'Response'].map((searchRes) => {
                            return <ResponseCard field={this.state.field} response={searchRes} 
                                    handleClick={this.handleClick.bind(this, this.state.field, searchRes)} />
                        })
                    }
                </div>
                
            </div>
        )
    }
}

export default UserInput

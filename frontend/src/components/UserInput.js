import React, { Component } from 'react'
import CafeInput from './CafeInput'
import CityInput from './CityInput'
import QueryStore from '../stores/QueryStore'
import ResponseCard from './ResponseCard'

export class UserInput extends Component {
    constructor(props) {
        console.log(props);
        super(props);
        this.state = {
            field: props.field,
            queryStateLoaded: false,
            queryState: QueryStore.getData(props.field)
        }
    }

    componentWillMount() {
        QueryStore.on(this.state.field + "Update", () => {
            this.setState({
                queryState: QueryStore.getData(this.state.field)
            })
        })
        this.setState({
            queryStateLoaded: true
        })
    }

    render() {
        return (
            <div className="userInput">
                <div className="messages">
                    {
                        this.state.queryState[this.state.field + 'Messages'].map(message => {
                            return <p style={{ color: message.type === 'warning' ? 'red' : 'grey' }}>{message.text}</p>
                        })
                    }
                </div>
                {
                    this.state.field === 'cafe' ? 
                    <CafeInput /> :
                    <CityInput />
                }{
                    this.state.queryStateLoaded &&
                    <ResponseCard field={this.state.field} queryState={this.state.queryState} />
                }
            </div>
        )
    }
}

export default UserInput

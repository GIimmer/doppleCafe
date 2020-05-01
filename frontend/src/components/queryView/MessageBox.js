import React, { Component } from 'react'
import QueryStore from '../../stores/QueryStore'
import { clearMessages } from "../../actions/QueryActions";
import { CSSTransition, TransitionGroup } from "react-transition-group";

export class MessageBox extends Component {
    _isMounted = true;

    constructor(props) {
        super(props);
        this.state = {
            field: props.field,
            messageProp: props.messageProp,
            queryState: QueryStore.getData(props.field)
        }
    }

    componentDidMount() {
        QueryStore.on(this.state.field + "Update", () => {
            this._isMounted && this.setState({
                queryState: QueryStore.getData(this.state.field)
            })
        })
        this.setMessageTimouts(this.state.queryState[this.state.messageProp]);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    setMessageTimouts(messages) {
        let genericTimeoutMessages = messages.filter((message) => {
            return message.timout === undefined
        }).map((message => message.id));

        if (genericTimeoutMessages.length > 0) {
            setTimeout(() => {
                clearMessages(this.state.field === 'cafe', genericTimeoutMessages);
            }, 8000)
        }
    }

    render() {
        return (
            <div className="messageSection">
                <TransitionGroup component="div" className="messages">
                    {
                        this.state.queryState[this.state.field + 'Messages'].map(message => {
                            return <CSSTransition
                                key={message.id}
                                timeout={400}
                                classNames="fade"
                                appear
                                unmountOnExit>
                                <p key={message.id}
                                style={{ color: message.type === 'warning' ? 'red' : 'grey' }}>{message.text}</p>
                            </CSSTransition>
                        })
                    }
                </TransitionGroup>
            </div>
        )
    }
}

export default MessageBox

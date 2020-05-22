import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clearMessagesFunc } from "../../../actions/queryActions";
import { CSSTransition, TransitionGroup } from "react-transition-group";


function mapStateToProps(state) {
    return {
        cityMessages: [...state.get('cityMessages')],
        cafeMessages: [...state.get('cafeMessages')]
    }
}

function mapDispatchToProps(dispatch) {
    return {
        clearMessages: clearMessagesFunc(dispatch)
    }
}

export class MessageBox extends Component {
    _isMounted = true;

    constructor(props) {
        super(props);
        this.state = {
            field: props.field,
            messageProp: props.messageProp
        }
    }

    componentDidMount() {
        this.setMessageTimouts(this.props[this.state.messageProp]);
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
                this.props.clearMessages(this.state.field === 'cafe', genericTimeoutMessages);
            }, 8000)
        }
    }

    render() {
        return (
            <div className="messageSection">
                <TransitionGroup component="div" className="messages">
                    {
                        this.props[this.state.messageProp].map(message => {
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageBox);

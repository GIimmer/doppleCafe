import React from 'react'
import Topic from './Topic'
import ABOUTTOPICS from './text'

function getStyle() {
    return {

    }
}

export default function AboutView() {
    return (
        <div id="AboutSectionHolder" style={getStyle()}>
            <div className="aboutSection">
                {
                    ABOUTTOPICS.map(topic => {
                        return <Topic key={topic.key} topic={topic} />
                    })
                }
            </div>
        </div>
    )
}

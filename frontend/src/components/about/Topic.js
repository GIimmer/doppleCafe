import React from 'react'

export default function Topic(props) {
    let topic = props.topic;
    return (
        <div className="topicSection">
            <h2 className="title">{topic.title}</h2>
            <p>{topic.text}</p>
            {
                topic.subTopics.map(subTopic => {
                    return <>
                        <h3 className="subTitle">{subTopic.title}</h3>
                        <p>{subTopic.text}</p>
                    </>
                })
            }
        </div>
    )
}

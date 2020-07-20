import React from 'react'
import { ReactCompareSlider } from 'react-compare-slider';

export default function Topic(props) {
    let topic = props.topic;
    return (
        <div className="topicSection">
            <h2 className="title">{topic.title}</h2>
            <p>{topic.text}</p>
            {
                topic.subTopics.map(subTopic => {
                    return <div className="subSectionHolder">
                        <div>
                            <h3 className="subTitle">{subTopic.title}</h3>
                            <p>{subTopic.text}</p>
                        </div>
                        {
                            subTopic.img !== undefined &&
                            <div className="topicImgHolder">
                                {
                                    !subTopic.img2 ?
                                    <img className="smallTopicImage" src={require(`./images/${subTopic.img}.png`)}></img>
                                    :
                                    <ReactCompareSlider
                                        itemOne={<img src={require(`./images/${subTopic.img}.png`)} alt={`Visual demo of ${subTopic.img}`} />}
                                        itemTwo={<img src={require(`./images/${subTopic.img2}.png`)} alt={`Visual demo of ${subTopic.img2}`} />}
                                        position={60}
                                    />
                                }
                            </div>
                        }
                    </div>
                })
            }
        </div>
    )
}

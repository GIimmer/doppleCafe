import React from 'react'
import ReactWordcloud from 'react-wordcloud';
import ACTION_CONSTS from '../../constants/ActionConstants'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { genGooglePlacePhoto } from '../../utilities/utilities';

const options = {
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
    enableTooltip: true,
    deterministic: false,
    fontFamily: 'impact',
    fontSizes: [10, 60],
    fontStyle: 'normal',
    fontWeight: 'normal',
    padding: 1,
    rotations: 5,
    rotationAngles: [-90, 90],
    scale: 'sqrt',
    spiral: 'archimedean',
    transitionDuration: 1000,
  };

export default function CafeDetails(props) {
    return (
        <div className="cafeDetails">
            {
                props.state === ACTION_CONSTS.CAFE_HOVER ?
                    <ReactWordcloud words={props.cafe.wordCloud} options={options} />
                    :
                    props.state === ACTION_CONSTS.CAFE_DETAILS_RETURNED ?
                        <Carousel>
                            <ReactWordcloud words={props.cafe.wordCloud} options={options} />
                            {
                                props.cafe.photos.map((photo) => {
                                    return <div>
                                        <img src={genGooglePlacePhoto(photo)} />
                                        <p className="legend">{photo.attr}</p>
                                    </div>
                                })
                            }
                        </Carousel>
                        :
                        <div></div>
            }
            
        </div>
    )
}

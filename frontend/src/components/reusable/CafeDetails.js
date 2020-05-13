import React, { PureComponent } from 'react'
import ReactWordcloud from 'react-wordcloud'
import { format } from 'timeago.js'
import DOMPurify from 'dompurify'
import QueryStore from '../../stores/QueryStore'
import ACTION_CONSTS from '../../constants/ActionConstants'
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from 'react-responsive-carousel'
import { genGooglePlacePhoto } from '../../utilities/utilities'
import CafeHours from './CafeHours'

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

export class CafeDetails extends PureComponent {
    _isMounted = true;

    constructor() {
        super();
        this.state = this.returnState();
    }

    componentDidMount() {
        QueryStore.on("detailsUpdate", () => {
            this._isMounted && this.setState(this.returnState());
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    returnState() {
        let queryState = QueryStore.getData('outcomeFilter'),
            viewingCafe = queryState.cafeDetails.cafeId ?
                queryState.cafeDetails[queryState.cafeDetails.cafeId]
                :
                queryState.similarCafes.find((cafe) => cafe.placeId === queryState.cafeDetails.cafeId);

        if (viewingCafe.wordCloud === undefined) {
            viewingCafe.wordCloud = viewingCafe.rawWordCloud.map((tuple) => {
                return { text: queryState.wordBagRef[tuple[0]], value: tuple[1] }
            })
        }

        return {
            queryState: queryState,
            cafe: viewingCafe,
            userActionState: queryState.cafeDetails.state
        }
    }

    prepareLink(link) {
        let sanitizedString = DOMPurify.sanitize(link);
        return (""+sanitizedString).replace(/<a\s+href=/gi, '<a target="_blank" href=');
    }

    formatReviewDate(date) {
        let parsedDate = Date.parse(date);
        return format(parsedDate);
    }

    render() {
        let cafe = this.state.cafe;
        return (
            <div className="cafeDetails">
                {
                    this.state.userActionState === ACTION_CONSTS.CAFE_DETAILS_RETURNED || cafe.detailsLoaded ?
                        <div>
                            <Carousel showThumbs={false}>
                                <ReactWordcloud words={cafe.wordCloud} options={options} />
                                {
                                    cafe.photos.map((photo) => {
                                        return <div className="carouselImage">
                                            <img src={genGooglePlacePhoto(photo)} />
                                            <span className="legend" dangerouslySetInnerHTML={{__html: this.prepareLink(photo.attr)}}></span>
                                        </div>
                                    })
                                }
                            </Carousel>
                            <div className="cafeInformation">
                                <div className="infoSection">
                                    <div>
                                        <h2>{cafe.name}</h2>
                                        <h5>{cafe.formattedAddress}</h5>
                                    </div>
                                    <div>
                                        <p>rating: <strong>{cafe.rating}</strong></p>
                                        <p>price level: <strong>{cafe.priceLevel}/5</strong></p>
                                    </div>                                
                                </div>
                                <div className="infoSection contactSection">
                                    <div>
                                        <a href={cafe.website} target="_blank">
                                            {cafe.website}
                                            </a>
                                        <a href={'tel:' + cafe.formattedPhoneNumber}>
                                            {cafe.formattedPhoneNumber}
                                        </a>
                                    </div>
                                    <div>
                                        <CafeHours hours={cafe.hours} />
                                    </div>
                                </div>
                            </div>
                            <div className="cafeReviews">
                                <div className="highlightBar"></div>
                                <h2>Some sample reviews</h2>
                                {
                                    cafe.reviews.map((review) => {
                                        return <div className="review">
                                            <div className="reviewContent">
                                                <div className="starRating">
                                                    <span>{review.rating}</span> <i className="fa fa-star fa-2x" aria-hidden="true"></i>
                                                </div>
                                                <p>{review.text}</p>
                                            </div>
                                            <div className="reviewDetails">
                                                <p>- {review.reviewer},</p>
                                                <p>{this.formatReviewDate(review.datetime)}</p>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>    
                        </div>
                        :
                        this.state.userActionState === ACTION_CONSTS.CAFE_HOVER ?
                            <ReactWordcloud words={cafe.wordCloud} options={options} />
                        :
                        <div></div>
                }
            </div>
        )
    }
}

export default CafeDetails
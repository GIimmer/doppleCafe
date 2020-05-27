import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ReactWordcloud from 'react-wordcloud'
import { format } from 'timeago.js'
import DOMPurify from 'dompurify'
import { CAFE_DETAILS_RETURNED } from '../../constants/ActionConstants'
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from 'react-responsive-carousel'
import { genGooglePlacePhoto } from '../../utilities/utilities'
import CafeHours from './CafeHours'

const options = (stateIsDetailsReturned) => {
    return {
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
        transitionDuration: stateIsDetailsReturned ? 0 : 1000,
    }
};

function mapStateToProps(state) {
    return {
        cafeDetails: state.get('cafeDetails'),
        returnedCafes: state.get('returnedCafes'),
        cafeLocMap: state.get('cafeLocMap'),
        wordBagRef: state.get('wordBagRef')
    }
}

export class CafeDetails extends PureComponent {
    _isMounted = true;

    componentWillUnmount() {
        this._isMounted = false;
    }

    getPreparedCafe() {
        const cafeDetails = this.props.cafeDetails, 
            cafeId = cafeDetails.get('cafeId');

        let viewingCafe = cafeDetails.get(cafeId);
        if (!viewingCafe && !!cafeId) {
            viewingCafe = this.props.returnedCafes.getIn(this.props.cafeLocMap.get(cafeId).toJS());
        }

        if (viewingCafe && viewingCafe.size && viewingCafe.get('wordCloud') === undefined) {
            const jsViewingCafe = viewingCafe.toJS()
            jsViewingCafe.wordCloud = jsViewingCafe.rawWordCloud.map((tuple) => {
                return { text: this.props.wordBagRef.get(tuple[0]), value: tuple[1] }
            })
            return jsViewingCafe;
        };
    }

    getCarouselHeight(showDetails) {
        return showDetails ? '150px' : '100%';
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
        let cafe = this.getPreparedCafe(),
            stateIsDetailsReturned = (this.props.cafeDetails.get('userActionState') === CAFE_DETAILS_RETURNED),
            showDetails = (stateIsDetailsReturned || (cafe && !!cafe.detailsLoaded));
        return (
            <div className="cafeDetails">
                {
                    !!cafe ?
                        <div>
                            <Carousel showThumbs={false}
                                showArrows={showDetails}
                                showStatus={showDetails}
                                showIndicators={showDetails}>
                                <div style={{ width: '100%', height: showDetails ? '300px' : '87vh', backgroundColor: showDetails ? 'black' : 'white' }}>
                                    <ReactWordcloud words={cafe.wordCloud} options={options(stateIsDetailsReturned)} />
                                </div>
                                {
                                    showDetails &&
                                    cafe.photos.map((photo, idx) => {
                                        return <div key={idx} className="carouselImage"
                                            style={{ backgroundImage: 'url(' + genGooglePlacePhoto(photo) + ')' }}>
                                            <span className="legend" dangerouslySetInnerHTML={{__html: this.prepareLink(photo.attr)}}></span>
                                        </div>
                                    })
                                }
                            </Carousel>
                            {
                                showDetails &&
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
                                            <span>{cafe.formattedPhoneNumber}</span>
                                        </div>
                                        <div>
                                            <CafeHours hours={cafe.hours} />
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                showDetails &&
                                <div className="cafeReviews">
                                    <div className="highlightBar"></div>
                                    <h2>Some sample reviews</h2>
                                    {
                                        cafe.reviews &&
                                        cafe.reviews.map((review, idx) => {
                                            return <div key={idx} className="review">
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
                            }
                        </div>
                        :
                        <div></div>
                }
            </div>
        )
    }
}

export default connect(mapStateToProps)(CafeDetails)
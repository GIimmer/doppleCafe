import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import DOMPurify from 'dompurify'
import { CAFE_DETAILS_RETURNED } from '../../../constants/ActionConstants'
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from 'react-responsive-carousel'
import { genGooglePlacePhoto } from '../../../utilities/utilities'
import CafeInformation from './CafeInformation'
import CafeReviews from './CafeReviews'
import CafeWordcloud from './CafeWordcloud'
import theme from '../../../styles/muiTheme'
import { List } from 'immutable'

const getCarouselStyle = (showDetails) => {
    const pal = theme.palette;
    return {
        width: '100%',
        height: showDetails ? '300px' : '87vh',
        backgroundColor: 'white',
        borderBottom: showDetails ? `27px solid ${pal.info.dark}` : 'none'
    }
}

export class CafeDetails extends PureComponent {
    myRef = React.createRef();
    _isMounted = true;

    componentWillUnmount() {
        this._isMounted = false;
    }

    getCarouselHeight(showDetails) {
        return showDetails ? '150px' : '100%';
    }

    prepareLink(link) {
        let sanitizedString = DOMPurify.sanitize(link);
        return (""+sanitizedString).replace(/<a\s+href=/gi, '<a target="_blank" href=');
    }

    render() {
        const cafeDetails = this.props.cafeDetails, 
            cafeId = cafeDetails.get('cafeId');
        let viewingCafe = cafeDetails.get(cafeId),
            cafeLoc = !!cafeId ? this.props.cafeLocMap.get(cafeId, List()).toJS() : null;

        if (!viewingCafe && cafeLoc) {
            viewingCafe = this.props.returnedCafes.getIn(cafeLoc);
        }

        let cafe = viewingCafe && viewingCafe.size ? viewingCafe.toJS() : viewingCafe,
            stateIsDetailsReturned = (cafeDetails.get('userActionState') === CAFE_DETAILS_RETURNED),
            showDetails = (stateIsDetailsReturned || (cafe && !!cafe.detailsLoaded));

        if (this.myRef.current) {
            this.myRef.current.setPosition(0);
        }
        
        return (
            <div className={`cafeDetails${showDetails ? ' scrollOverflow' : ''}`}>
                {
                    !!cafe ?
                        <div>
                            <Carousel showThumbs={false}
                                showArrows={showDetails}
                                showStatus={showDetails}
                                showIndicators={showDetails}
                                ref={this.myRef}>
                                <div style={getCarouselStyle(showDetails)}>
                                    <CafeWordcloud 
                                        rawWordCloud={cafe.rawWordCloud}
                                        groupLoc={cafeLoc[0]}
                                        stateIsDetailsReturned={stateIsDetailsReturned}
                                    />
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
                                <>
                                    <CafeInformation cafe={cafe} />
                                    <CafeReviews reviews={cafe.reviews} />
                                </>
                            }
                        </div>
                        :
                        <div></div>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        cafeDetails: state.get('cafeDetails'),
        returnedCafes: state.get('returnedCafes'),
        cafeLocMap: state.get('cafeLocMap'),
    }
}

export default connect(mapStateToProps)(CafeDetails)
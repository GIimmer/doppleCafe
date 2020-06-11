import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ReactWordcloud from 'react-wordcloud'
import DOMPurify from 'dompurify'
import { CAFE_DETAILS_RETURNED } from '../../../constants/ActionConstants'
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from 'react-responsive-carousel'
import { genGooglePlacePhoto } from '../../../utilities/utilities'
import CafeInformation from './CafeInformation'
import CafeReviews from './CafeReviews'
import theme from '../../../styles/muiTheme'
import { List } from 'immutable'

const options = (stateIsDetailsReturned) => {
   return {
        enableTooltip: false,
        fontFamily: 'impact',
        fontSizes: [10, 60],
        fontStyle: 'normal',
        fontWeight: 'normal',
        padding: 1,
        rotations: 5,
        rotationAngles: [-20, 20],
        scale: 'sqrt',
        transitionDuration: stateIsDetailsReturned ? 0 : 1000,
    }
};

const getCarouselStyle = (showDetails) => {
    const pal = theme.palette;
    return {
        width: '100%',
        height: showDetails ? '300px' : '87vh',
        backgroundColor: 'white',
        borderBottom: showDetails ? `27px solid ${pal.info.dark}` : 'none'
    }
}

function getColorFunc(targetCafeDict) {
    const pal = theme.palette,
        colorChoices = [pal.secondary.main, pal.secondary.dark, pal.info.dark];
    return ({ text }) => {
        return targetCafeDict[text] ?
        pal.primary.main
        :
        colorChoices[Math.floor(Math.random() * colorChoices.length)]
    }
}

function mapStateToProps(state) {
    return {
        cafeDetails: state.get('cafeDetails'),
        returnedCafes: state.get('returnedCafes'),
        cafeLocMap: state.get('cafeLocMap'),
        wordBagRef: state.get('wordBagRef'),
        commonTermsRefMap: state.get('commonTermsRefMap')
    }
}

export class CafeDetails extends PureComponent {
    state = {};
    _isMounted = true;

    componentDidMount() {
        const wordBagRef = this.props.wordBagRef;
        const targetWordBag = this.props.returnedCafes.getIn([0,0, 'rawWordCloud']),
            targetCafeWordPresRef = targetWordBag.reduce((o, key) => ({ ...o, [wordBagRef.get(key.get(0))]: true }), {});
        this.setState({
            'targetCafeWordPresRef': targetCafeWordPresRef
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getPreparedCafe(viewingCafe) {
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

    getCommonTermsRef(cafeLoc) {
        console.log('here is state: ', this.state);
        console.log('here is cafeLoc: ', cafeLoc);
        if (this.state.targetCafeWordPresRef && cafeLoc && cafeLoc.length) {
            return this.props.commonTermsRefMap.get(cafeLoc[0].toString()).toJS();
        }
    }

    render() {
        const cafeDetails = this.props.cafeDetails, 
            cafeId = cafeDetails.get('cafeId'),
            viewingCafe = cafeDetails.get(cafeId),
            cafeLoc = !!cafeId ? this.props.cafeLocMap.get(cafeId, List()).toJS() : null;

        if (!viewingCafe && cafeLoc) {
            viewingCafe = this.props.returnedCafes.getIn(cafeLoc);
        }

        let cafe = this.getPreparedCafe(viewingCafe),
            stateIsDetailsReturned = (this.props.cafeDetails.get('userActionState') === CAFE_DETAILS_RETURNED),
            showDetails = (stateIsDetailsReturned || (cafe && !!cafe.detailsLoaded));

        const commonTermsRefMap = this.getCommonTermsRef(cafeLoc);
        return (
            <div className={`cafeDetails${showDetails ? ' scrollOverflow' : ''}`}>
                {
                    !!cafe ?
                        <div>
                            <Carousel showThumbs={false}
                                showArrows={showDetails}
                                showStatus={showDetails}
                                showIndicators={showDetails}>
                                <div style={getCarouselStyle(showDetails)}>
                                    <ReactWordcloud
                                        words={cafe.wordCloud}
                                        options={options(stateIsDetailsReturned)}
                                        callbacks={{
                                            getWordColor: getColorFunc(commonTermsRefMap),
                                          }}
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

export default connect(mapStateToProps)(CafeDetails)
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
    const pal = theme.palette;
    return ({ text }) => {
        return targetCafeDict[text] || pal.secondary.main;
    }
}

export class CafeDetails extends PureComponent {
    state = {};
    myRef = React.createRef();
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

    getTermColorMap(cafeLoc, dnTerms, termFilters, highlightRWFriendly) {
        if (this.state.targetCafeWordPresRef && cafeLoc && cafeLoc.length) {
            const pal = theme.palette;
            let groupCommonTerms = this.props.commonTermsRefMap.get(cafeLoc[0].toString()).toJS();
            for (let key of Object.keys(groupCommonTerms)) { groupCommonTerms[key] = pal.warning.dark; }
            highlightRWFriendly && dnTerms.forEach(term => { groupCommonTerms[term] = 'rgb(0, 209, 105)' });
            termFilters.forEach(term => groupCommonTerms[term] = pal.primary.light);
            return groupCommonTerms;
        }
    }

    render() {
        const cafeDetails = this.props.cafeDetails, 
            cafeId = cafeDetails.get('cafeId');
        let viewingCafe = cafeDetails.get(cafeId),
            cafeLoc = !!cafeId ? this.props.cafeLocMap.get(cafeId, List()).toJS() : null;

        if (!viewingCafe && cafeLoc) {
            viewingCafe = this.props.returnedCafes.getIn(cafeLoc);
        }

        let cafe = this.getPreparedCafe(viewingCafe),
            stateIsDetailsReturned = (this.props.cafeDetails.get('userActionState') === CAFE_DETAILS_RETURNED),
            showDetails = (stateIsDetailsReturned || (cafe && !!cafe.detailsLoaded));

        if (this.myRef.current) {
            this.myRef.current.setPosition(0);
        }
        
        const termColorMap = this.getTermColorMap(
                                                cafeLoc, 
                                                this.props.dnTerms.toJS(), 
                                                this.props.termFilters.toJS(),
                                                this.props.highlightRWFriendly
                                                );
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
                                    <ReactWordcloud
                                        words={cafe.wordCloud}
                                        options={options(stateIsDetailsReturned)}
                                        callbacks={{
                                            getWordColor: getColorFunc(termColorMap),
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

function mapStateToProps(state) {
    return {
        cafeDetails: state.get('cafeDetails'),
        returnedCafes: state.get('returnedCafes'),
        cafeLocMap: state.get('cafeLocMap'),
        wordBagRef: state.get('wordBagRef'),
        termFilters: state.get('filteringByTerms'),
        dnTerms: state.get('dnTerms'),
        highlightRWFriendly: state.get('highlightRWFriendly'),
        commonTermsRefMap: state.get('commonTermsRefMap')
    }
}

export default connect(mapStateToProps)(CafeDetails)
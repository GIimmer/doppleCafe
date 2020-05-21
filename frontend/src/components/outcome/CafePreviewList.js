import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import CafePreview from './CafePreview'
import { setViewingDetailsFunc, loadCafeDetailsFunc, highlightCafeOnMapFunc, toggleCafeHoverFunc } from '../../actions/outcomeActions';

function mapDispatchToProps(dispatch) {
    return {
        setViewingDetails: setViewingDetailsFunc(dispatch),
        loadCafeDetails: loadCafeDetailsFunc(dispatch),
        highlightCafeOnMap: highlightCafeOnMapFunc(dispatch),
        toggleCafeHover: toggleCafeHoverFunc(dispatch)
    }
}

function mapStateToProps(state=Map()) {
    return {
        similarCafes: state.get('similarCafes')
    }
}

class CafePreviewList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            group: props.group
        }
    }

    handleClick(action, cafe, e) {
        e.preventDefault();
        let cafeId = cafe ? cafe.placeId : null;
        switch (action) {
            case 'loadDetails':
                if (cafe.detailsLoaded) {
                    this.props.setViewingDetails(cafe);
                } else {
                    this.props.loadCafeDetails(cafeId);
                }
                break;

            case 'mapHighlight':
                this.props.highlightCafeOnMap(cafeId);
                window.scrollTo(0,0);
                break;

            case 'hoverOver':
                this.props.toggleCafeHover(cafeId, true);
                break;
        
            default:
                break;
        }
    }

    render() {
        const similarCafes = this.props.similarCafes.toJS();
        return (
            <div className="cafePreviewList" onMouseLeave={this.props.toggleCafeHover.bind(this, null, false)}>
                <h2>{this.state.group ? `Group #${this.state.group}:` : 'Most similar cafes, ranked in order:'}</h2>
                {
                    similarCafes.map((cafe) => {
                        return <CafePreview cafe={cafe} key={cafe.placeId} handleClick={this.handleClick} parentContext={this} />
                    })
                }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CafePreviewList)
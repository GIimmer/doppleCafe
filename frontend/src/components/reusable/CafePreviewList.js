import React, { PureComponent } from 'react'
import QueryStore from'../../stores/QueryStore'
import { toggleCafeOptionHover, loadCafeDetails, highlightCafeOnMap } from '../../actions/QueryActions';
import CafePreview from './CafePreview'

export default class CafePreviewList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            group: props.group,
            queryState: QueryStore.getData('outcomeFilter')
        }
    }

    componentDidMount() {
        QueryStore.on("change", () => {
            this.setState({
                queryState: QueryStore.getData('outcomeFilter')
            })
        })
    }

    handleClick(action, cafeId, e) {
        e.preventDefault();
        switch (action) {
            case 'loadDetails':
                loadCafeDetails(cafeId);
                break;

            case 'mapHighlight':
                highlightCafeOnMap(cafeId);
                break;

            case 'hoverOver':
                toggleCafeOptionHover(cafeId, true);
                break;
        
            default:
                toggleCafeOptionHover(cafeId, false);
                break;
        }
    }

    render() {
        return (
            <div className="cafePreviewList">
                <h2>{this.state.group ? `Group #${this.state.group}:` : 'Most similar cafes, ranked in order:'}</h2>
                {
                    this.state.queryState.similarCafes.map((cafe) => {
                        return <CafePreview cafe={cafe} key={cafe.placeId} handleClick={this.handleClick} />
                    })
                }
            </div>
        )
    }
}

import React from 'react'
import { connect } from 'react-redux'
import theme from '../../../styles/muiTheme'
import { withRouter } from 'react-router-dom'
import { CONSTS } from "../../../constants/Constants"


function getTermColorTips(highlightRWFriendly, filteringByTerms, forSimilar) {
    let pal = theme.palette;
    return [
        {
            tip: "Top 100 terms shown",
            color: pal.secondary.main
        },
        {
            tip: `In common with the ${forSimilar ? "target cafe" : "group"}`,
            color: pal.warning.dark
        },
        ...highlightRWFriendly ? [{ tip: `remote work related`, color: 'rgb(0, 209, 105)' }] : [],
        ...filteringByTerms ? [{ tip: `filtering by`, color: pal.primary.light }] : []
    ];
}

const idxToAbsRef = [
    { top: '0px', left: '0px'},
    { top: '0px', right: '0px'},
    { bottom: '0px', left: '0px'},
    { bottom: '0px', right: '0px'}
]

function getStyle(tip, idx) {
    return Object.assign({
        color: tip.color,
    }, idxToAbsRef[idx])
}

export function TermColorTips(props) {
    const termColorTips = props.showTips ?
    getTermColorTips(props.highlightRWFriendly, !!props.termFilters.size, props.searchingBySimilar) : [];
    return (
        <>
            {
                termColorTips.map((tip, idx) => {
                    return <div className="termColorTip" key={'tip_' + idx} style={getStyle(tip, idx)}>{tip.tip}</div>
                })
            }
        </>
    )
}

function mapStateToProps(state, props) {
    let currentTab = props.location.pathname.substr(1);
    return {
        termFilters: state.get('filteringByTerms'),
        highlightRWFriendly: state.get('highlightRWFriendly'),
        searchingBySimilar: (currentTab === CONSTS.QUERY_OUTCOME_VIEW)
    }
}

export default withRouter(connect(mapStateToProps)(TermColorTips));

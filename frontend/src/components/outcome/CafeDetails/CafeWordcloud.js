import React from 'react'
import { connect } from 'react-redux'
import theme from '../../../styles/muiTheme'
import ReactWordcloud from 'react-wordcloud'

const options = (stateIsDetailsReturned) => {
    return {
         enableOptimizations: true,
         enableTooltip: false,
         fontFamily: 'impact',
         fontSizes: [12, 70],
         fontStyle: 'normal',
         fontWeight: 'normal',
         padding: 1,
         rotations: 1,
         rotationAngles: [-0, 0],
         scale: 'sqrt',
         transitionDuration: stateIsDetailsReturned ? 0 : 1000,
     }
 };

function getColorFunc(targetCafeDict) {
    const pal = theme.palette;
    return ({ text }) => {
        return targetCafeDict[text] || pal.secondary.main;
    }
}

function getTermColorMap(props) {
    const groupLoc = props.groupLoc,
        commonTermsRefMap = props.commonTermsRefMap,
        dnTerms = props.dnTerms.toJS(),
        termFilters = props.termFilters.toJS(),
        highlightRWFriendly = props.highlightRWFriendly;

    if (groupLoc !== undefined) {
        const pal = theme.palette;
        let groupCommonTerms = commonTermsRefMap.get(groupLoc.toString()).toJS();
        for (let key of Object.keys(groupCommonTerms)) { groupCommonTerms[key] = pal.warning.dark; }
        highlightRWFriendly && dnTerms.forEach(term => { groupCommonTerms[term] = 'rgb(0, 209, 105)' });
        termFilters.forEach(term => groupCommonTerms[term] = pal.primary.light);
        return groupCommonTerms;
    }
}

export const CafeWordcloud = (props) => {
    const termColorMap = getTermColorMap(props),
        wordBagRef = props.wordBagRef;

    const wordCloud = props.rawWordCloud.map((tuple) => {
        return { text: wordBagRef.get(tuple[0]), value: tuple[1] }
    })

    return (
        <ReactWordcloud
            words={wordCloud}
            options={options(props.stateIsDetailsReturned)}
            callbacks={{
                getWordColor: getColorFunc(termColorMap),
            }}
        />
    )
}

function mapStateToProps(state) {
    return {
        dnTerms: state.get('dnTerms'),
        wordBagRef: state.get('wordBagRef'),
        termFilters: state.get('filteringByTerms'),
        highlightRWFriendly: state.get('highlightRWFriendly'),
        commonTermsRefMap: state.get('commonTermsRefMap')
    }
}

export default connect(mapStateToProps)(CafeWordcloud);

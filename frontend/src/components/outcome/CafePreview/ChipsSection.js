import React from 'react'
import Chip from '@material-ui/core/Chip'

export default function ChipsSection(props) {
    const termsRef = props.commonTermsRef;
    const topSixCommonTerms = Object.keys(termsRef).sort((a,b) => termsRef[a] - termsRef[b]).slice(0, 6);
    return (
        <>
            {
                topSixCommonTerms && !!topSixCommonTerms.length &&
                <div style={{margin: '5px 5px 20px' }}>
                    <p style={{ margin: '0px 0px 5px' }}>This grouping <em>may</em> emphasize the following terms: </p>
                    <div className="groupChipsHolder" style={{  }}>
                        {
                            topSixCommonTerms.map(term => {
                                return <Chip label={term} style={{ margin: '5px 10px 5px 0px' }} />
                            })
                        }
                    </div>
                </div>
            }
        </>
    )
}

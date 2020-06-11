import React from 'react'
import { format } from 'timeago.js'

function formatReviewDate(date) {
    let parsedDate = Date.parse(date);
    return format(parsedDate);
}

export default function CafeReviews(props) {
    return (
        <div className="cafeReviews">
            <div className="highlightBar"></div>
            <h2>Some sample reviews</h2>
            {
                props.reviews &&
                props.reviews.map((review, idx) => {
                    return <div key={idx} className="review">
                        <div className="reviewContent">
                            <div className="starRating">
                                <span>{review.rating}</span> <i className="fa fa-star fa-2x" aria-hidden="true"></i>
                            </div>
                            <p>{review.text}</p>
                        </div>
                        <div className="reviewDetails">
                            <p>- {review.reviewer},</p>
                            <p>{formatReviewDate(review.datetime)}</p>
                        </div>
                    </div>
                })
            }
        </div>
    )
}

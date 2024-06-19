import React from 'react'
import './review.scss'
import StarProgressBar from './components/StarProgressBar'
import { IBusiness } from '@/types/business'
import ReviewList from './components/ReviewList'

export default function Review({ business }: { business: IBusiness }): React.ReactNode {
  const rating = business.overallRating
  const totalReview = business.totalReview

  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  console.log(business)
  return (
    <div className='review-wrapper'>
      <div className='container review-container pb-2'>
        <div className='mt-4 d-flex'>
          <div className='star-progress-bar-wrapper'>
            <StarProgressBar stars={business.stars} />
          </div>
          <div className='rating-detail-wrapper d-flex flex-column align-items-center justify-content-center'>
            <div className='rating-detail'>{business.overallRating.toFixed(1)}</div>
            <div className='business-rating d-flex flex-column align-items-center mb-1'>
              <div className='rating-star d-flex align-items-center'>
                {Array.from({ length: fullStars }, (_, index) => (
                  <i key={`full-${index}`} className='fa-solid fa-star star-fill'></i>
                ))}
                {hasHalfStar && <i className='fa-solid fa-star-half star-fill'></i>}
                {Array.from({ length: emptyStars }, (_, index) => (
                  <i key={`empty-${index}`} className='fa-solid fa-star'></i>
                ))}
              </div>
              <div className='total-rating'>{`${totalReview} reviews`}</div>
            </div>
          </div>
        </div>
        <div className='p-3 d-flex align-items-center justify-content-center'>
          <div className='send-review-btn p-1 d-flex align-items-center justify-content-center'>
            <i className='fa-regular fa-comment-dots me-2'></i>
            Write a review
          </div>
        </div>
      </div>

      <div className='review-list-container p-3'>
        <ReviewList />
      </div>
    </div>
  )
}

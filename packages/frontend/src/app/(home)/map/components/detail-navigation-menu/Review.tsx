import React from 'react'
import './review.scss'
import StarProgressBar from './components/StarProgressBar'
import { IBusiness } from '@/types/business'

export default function Review({ business }: { business: IBusiness }): React.ReactNode {
  const rating = business.overallRating
  const totalReview = business.totalReview

  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  console.log(business)
  return (
    <div className='review-wrapper'>
      <div className='container '>
        <div className='mt-4 d-flex'>
          <div className='star-progress-bar-wrapper'>
            <StarProgressBar stars={business.stars} />
          </div>
          <div className='rating-detail-wrapper d-flex flex-column align-items-center justify-content-center'>
            <div className='rating-detail'>{business.overallRating.toFixed(1)}</div>
            <div className='business-rating d-flex flex-column align-items-center mb-1'>
              <div className='rating-star '>
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
      </div>
    </div>
  )
}

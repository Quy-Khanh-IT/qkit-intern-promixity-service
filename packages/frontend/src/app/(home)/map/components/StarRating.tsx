import './star-rating.scss'
export default function StarRating({ rating, totalReview }: { rating: number; totalReview: number }): React.ReactNode {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className='business-rating d-flex align-items-center mb-1 mt-1'>
      <div className='rating-count'>{rating.toFixed(1)}</div>
      <div className='rating-star '>
        {Array.from({ length: fullStars }, (_, index) => (
          <i key={`full-${index}`} className='fa-solid fa-star star-fill'></i>
        ))}
        {hasHalfStar && <i className='fa-solid fa-star-half star-fill'></i>}
        {Array.from({ length: emptyStars }, (_, index) => (
          <i key={`empty-${index}`} className='fa-solid fa-star'></i>
        ))}
      </div>
      <div className='total-rating'>{`(${totalReview})`}</div>
    </div>
  )
}

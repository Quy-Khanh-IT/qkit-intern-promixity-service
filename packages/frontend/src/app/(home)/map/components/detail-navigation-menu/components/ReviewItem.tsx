'use client'
import { IReply, IReplyReply, IReview } from '@/types/review'
import { Image } from 'antd'
import moment from 'moment'
import './review-item.scss'
export default function ReviewItem({ review }: { review: IReview }): React.ReactNode {
  const formatTimeDifference = (createdAt: string): string => {
    const now = moment()
    const createdAtMoment = moment(createdAt)
    const duration = moment.duration(now.diff(createdAtMoment))

    const minutes = duration.asMinutes()
    if (minutes < 60) {
      return `${Math.floor(minutes)} minutes ago`
    }

    const hours = duration.asHours()
    if (hours < 24) {
      return `${Math.floor(hours)} hours ago`
    }

    const days = duration.asDays()
    if (days < 30) {
      return `${Math.floor(days)} days ago`
    }

    const months = duration.asMonths()
    if (months < 12) {
      return `${Math.floor(months)} months ago`
    }

    const years = duration.asYears()
    return `${Math.floor(years)} years ago`
  }

  const rating = review.star
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  const renderReplyRecursive = (reply: IReply | IReplyReply, level: number = 0): React.ReactNode => {
    return (
      <div
        key={reply.id}
        className={`review-reply-wrapper mt-2 ${level === 0 ? 'first-reply ps-3' : level === 1 ? 'ps-4' : ''}`}
      >
        <div className='review-owner-info'>
          <div className='review-owner-avatar d-flex mb-2'>
            <Image
              src={
                reply.postBy.avatarUrl
                  ? reply.postBy.avatarUrl
                  : 'https://raw.githubusercontent.com/ninehcobra/free-host-image/main/News/logo.png'
              }
              alt='owner-avatar'
              width={32}
              height={32}
              fallback={'https://raw.githubusercontent.com/ninehcobra/free-host-image/main/News/logo.png'}
            />
            <div className='ms-2'>
              <div className='owner-name'>{reply.postBy.firstName}</div>
              <div className='review-time'>{formatTimeDifference(reply.created_at)}</div>
            </div>
          </div>
        </div>
        <div className='review-content mt-2'>{reply.content}</div>
        <div className='mb-1 mt-2 btn-reply'>Reply</div>
        {reply.replies && reply.replies.length > 0 && (
          <div>{reply.replies.map((childReply: IReplyReply) => renderReplyRecursive(childReply, level + 1))}</div>
        )}
      </div>
    )
  }
  return (
    <div className='review-wrapper p-3'>
      {/* Start Review */}
      <div className='review-owner-info '>
        <div className='review-owner-avatar d-flex mb-2'>
          <Image
            src={
              review.postBy.avatarUrl
                ? review.postBy.avatarUrl
                : 'https://raw.githubusercontent.com/ninehcobra/free-host-image/main/News/logo.png'
            }
            alt='owner-avatar'
            width={32}
            height={32}
            fallback={'https://raw.githubusercontent.com/ninehcobra/free-host-image/main/News/logo.png'}
          />
          <div className='ms-2'>
            <div className='owner-name'>{review.postBy.firstName} </div>
            <div className='review-time'>{formatTimeDifference(review.created_at)}</div>
          </div>
        </div>
      </div>

      <div className='business-rating d-flex  mt-3'>
        <div className='rating-star d-flex align-items-center'>
          {Array.from({ length: fullStars }, (_, index) => (
            <i key={`full-${index}`} className='fa-solid fa-star star-fill'></i>
          ))}
          {hasHalfStar && <i className='fa-solid fa-star-half star-fill'></i>}
          {Array.from({ length: emptyStars }, (_, index) => (
            <i key={`empty-${index}`} className='fa-solid fa-star'></i>
          ))}
        </div>
      </div>
      <div className='review-content mt-2'>{review.content}</div>
      <div className='mb-3 mt-2 btn-reply'>Reply</div>
      {/* End review */}

      {/* Reply */}
      <div className='review-reply-wrapper mt-2 ps-3'>
        {review.reply && review.reply.data && review.reply.data.length > 0
          ? review.reply.data.map((reply) => renderReplyRecursive(reply))
          : ''}
      </div>
    </div>
  )
}

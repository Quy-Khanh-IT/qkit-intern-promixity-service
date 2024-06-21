'use client'
import { IReply, IReplyReply, IReview } from '@/types/review'
import { Image } from 'antd'
import moment from 'moment'
import './review-item.scss'
import { useEffect, useState } from 'react'
import { useCreateCommentMutation, useCreateResponseCommentMutation } from '@/services/review.service'
import { toast } from 'react-toastify'

export default function ReviewItem({ review }: { review: IReview }): React.ReactNode {
  const [replyInputValue, setReplyInputValue] = useState<{ [key: string]: string }>({})
  const [showReplyInput, setShowReplyInput] = useState<{ [key: string]: boolean }>({})
  const [showReadMoreReplyInput, setShowReadMoreReplyInput] = useState<{ [key: string]: boolean }>({})

  const [isReadMoreComment, setIsReadMoreComment] = useState<boolean>(false)
  const [createResponseComment, { isSuccess: isCreateResponseSuccess, isError: isCreateResponseError }] =
    useCreateResponseCommentMutation()

  const [showCommentInput, setShowCommentInput] = useState<boolean>(false)
  const [commentValue, setCommentValue] = useState<string>('')
  const [createComment, { isSuccess: isCreateCommentSuccess, isError: isCreateCommentError }] =
    useCreateCommentMutation()
  const handleReplyClick = (replyId: string): void => {
    setShowReplyInput({ ...showReplyInput, [replyId]: true })
    if (!replyInputValue[replyId]) {
      setReplyInputValue({ ...replyInputValue, [replyId]: '' })
    }
  }

  const handleOpenReadmoreReply = (replyId: string): void => {
    setShowReadMoreReplyInput({ ...showReadMoreReplyInput, [replyId]: true })
  }
  const handleCancelReadmoreReply = (replyId: string): void => {
    setShowReadMoreReplyInput({ ...showReadMoreReplyInput, [replyId]: false })
  }
  const handleCancelReply = (replyId: string): void => {
    setShowReplyInput({ ...showReplyInput, [replyId]: false })
    setReplyInputValue({ ...replyInputValue, [replyId]: '' })
  }

  const handleInputChange = (replyId: string, value: string): void => {
    setReplyInputValue({ ...replyInputValue, [replyId]: value })
  }

  const handlePostReply = (replyId: string): void => {
    if (!replyInputValue[replyId]) {
      toast.error('Please enter a reply')
    } else {
      createResponseComment({
        commentId: replyId,
        content: replyInputValue[replyId]
      })
    }

    setReplyInputValue({ ...replyInputValue, [replyId]: '' })
    setShowReplyInput({ ...showReplyInput, [replyId]: false })
  }

  const handlePostComment = (): void => {
    if (!commentValue) {
      toast.error('Please enter a comment')
    } else {
      createComment({
        content: commentValue,
        reviewId: review.id
      })
    }
    setCommentValue('')
    setShowCommentInput(false)
  }

  useEffect(() => {
    if (isCreateCommentSuccess) {
      toast.success('Comment has been posted')
    } else if (isCreateCommentError) {
      toast.error('Failed to post comment')
    }
  }, [isCreateCommentSuccess, isCreateCommentError])

  useEffect(() => {
    if (isCreateResponseSuccess) {
      toast.success('Reply has been posted')
    } else if (isCreateResponseError) {
      toast.error('Failed to post reply')
    }
  }, [isCreateResponseSuccess, isCreateResponseError])

  const formatTimeDifference = (createdAt: string | undefined): string => {
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
        className={`review-reply-wrapper mt-2 ${level === 0 ? 'first-reply ps-4' : level === 1 ? 'ps-4 review-reply-container' : ''}`}
      >
        <div className='review-owner-info'>
          <div className='review-owner-avatar d-flex mb-2'>
            <Image
              src={
                reply.postBy.avatarUrl ||
                'https://raw.githubusercontent.com/ninehcobra/free-host-image/main/News/logo.png'
              }
              alt='owner-avatar'
              width={32}
              height={32}
              fallback={'https://raw.githubusercontent.com/ninehcobra/free-host-image/main/News/logo.png'}
            />
            <div className='ms-2'>
              <div className='owner-name'>{reply.postBy.firstName}</div>
              <div className='review-time'>{formatTimeDifference(reply.created_at || '')}</div>
            </div>
          </div>
        </div>
        <div className='review-content mt-2'>{reply.content}</div>

        {showReplyInput[reply.id] ? (
          <div className='d-flex justify-content-between align-items-center mt-2'>
            <div className='reply-input-wrapper'>
              <input
                className='p-2 reply-input'
                type='text'
                value={replyInputValue[reply.id]}
                onChange={(e) => handleInputChange(reply.id, e.target.value)}
                placeholder='Write a reply...'
              />
            </div>
            <div className='d-flex'>
              <div onClick={() => handleCancelReply(reply.id)} className='mb-1 mt-2 btn-reply me-2 cancel-btn'>
                Cancel
              </div>
              <div onClick={() => handlePostReply(reply.id)} className='mb-1 mt-2 btn-reply'>
                Post
              </div>
            </div>
          </div>
        ) : (
          <div className='d-flex align-items-center justify-content-between mt-2'>
            <div></div>
            <div className='mb-1 mt-2 btn-reply' onClick={() => handleReplyClick(reply.id)}>
              Reply
            </div>
          </div>
        )}
        {reply.replies &&
          reply.replies.length > 0 &&
          (!showReadMoreReplyInput[reply.id] ? (
            <div onClick={() => handleOpenReadmoreReply(reply.id)} className=' mb-3 read-more-btn'>
              Read More replies
            </div>
          ) : (
            <div onClick={() => handleCancelReadmoreReply(reply.id)} className=' mb-3 read-more-btn'>
              Read Less
            </div>
          ))}

        {showReadMoreReplyInput[reply.id] && reply.replies && reply.replies.length > 0 && (
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
      {showCommentInput ? (
        <div className='d-flex justify-content-between align-items-center mt-2'>
          <div className='reply-input-wrapper'>
            <input
              className='p-2 reply-input'
              type='text'
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              placeholder='Write a reply...'
            />
          </div>
          <div className='d-flex'>
            <div onClick={() => setShowCommentInput(false)} className='mb-1 mt-2 btn-reply me-2 cancel-btn'>
              Cancel
            </div>
            <div onClick={handlePostComment} className='mb-1 mt-2 btn-reply'>
              Post
            </div>
          </div>
        </div>
      ) : (
        <div className='d-flex align-items-center justify-content-between mt-2'>
          <div></div>
          <div className='mb-1 mt-2 btn-reply' onClick={() => setShowCommentInput(true)}>
            Reply
          </div>
        </div>
      )}
      {/* End review */}

      {/* Reply */}
      {review.reply && review.reply.data && review.reply.data.length > 0 && (
        <div onClick={() => setIsReadMoreComment(!isReadMoreComment)} className=' mb-2 read-more-btn'>
          {isReadMoreComment ? 'Read Less' : 'Read More replies'}
        </div>
      )}
      {isReadMoreComment ? (
        <div className='review-reply-wrapper  mt-2 ps-1'>
          {review.reply && review.reply.data && review.reply.data.length > 0
            ? review.reply.data.map((reply) => renderReplyRecursive(reply))
            : ''}
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

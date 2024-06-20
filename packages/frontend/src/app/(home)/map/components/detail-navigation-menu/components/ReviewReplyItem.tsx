'use client'
import { IReply, IReplyReply } from '@/types/review'
import { Image } from 'antd'
import moment from 'moment'
import { useCreateResponseCommentMutation } from '@/services/review.service'
import { toast } from 'react-toastify'
import { useState, useRef } from 'react'

interface ReviewReplyItemProps {
  reply: IReply | IReplyReply
  level: number
}

const ReviewReplyItem: React.FC<ReviewReplyItemProps> = ({ reply, level }) => {
  const [replyInputs, setReplyInputs] = useState<Record<string, boolean>>({})
  const replyTextRefs = useRef<Record<string, string>>({})

  const toggleReplyInput = (replyId: string): void => {
    setReplyInputs((prevState) => ({
      ...prevState,
      [replyId]: !prevState[replyId]
    }))
  }

  const [createResponseComment, { isSuccess: isCreateResponseSuccess, isError: isCreateResponseError }] =
    useCreateResponseCommentMutation()

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

  const renderReplyRecursive = (reply: IReply | IReplyReply, level: number = 0): React.ReactNode => {
    // Make sure the reply text state is initialized
    if (!(reply.id in replyTextRefs.current)) {
      replyTextRefs.current[reply.id] = ''
    }

    const [replyText, setReplyText] = useState<string>(replyTextRefs.current[reply.id] || '')

    const handlePostReply = (): void => {
      console.log('Post reply:', replyText)
      if (replyText !== '') {
        createResponseComment({
          commentId: reply.id,
          content: replyText
        })
          .then(() => {
            toast.success('Reply has been posted')
            setReplyText('')
            replyTextRefs.current[reply.id] = ''
          })
          .catch((error) => {
            toast.error('Failed to post reply')
            console.error(error)
          })
      } else {
        toast.error('Please enter your reply first')
      }
    }

    return (
      <div
        key={reply.id}
        className={`review-reply-wrapper mt-2 ${level === 0 ? 'first-reply ps-3' : level === 1 ? 'ps-4' : 'ps-4'}`}
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

        <div className=''>
          {replyInputs[reply.id] ? (
            <div className='d-flex justify-content-between align-items-center mt-2'>
              <div className='reply-input-wrapper'>
                <input
                  className='p-2 reply-input'
                  type='text'
                  value={replyText}
                  onChange={(e) => {
                    setReplyText(e.target.value)
                    replyTextRefs.current[reply.id] = e.target.value
                  }}
                  placeholder='Write a reply...'
                />
              </div>
              <div className='d-flex'>
                <div onClick={() => toggleReplyInput(reply.id)} className='mb-1 mt-2 btn-reply me-2 cancel-btn'>
                  Cancel
                </div>
                <div onClick={handlePostReply} className='mb-1 mt-2 btn-reply'>
                  Post
                </div>
              </div>
            </div>
          ) : (
            <div onClick={() => toggleReplyInput(reply.id)} className='mb-1 mt-2 btn-reply'>
              Reply
            </div>
          )}
        </div>
        {reply.replies && reply.replies.length > 0 && (
          <div>{reply.replies.map((childReply: IReplyReply) => renderReplyRecursive(childReply, level + 1))}</div>
        )}
      </div>
    )
  }

  return <div>{renderReplyRecursive(reply, level)}</div>
}

export default ReviewReplyItem

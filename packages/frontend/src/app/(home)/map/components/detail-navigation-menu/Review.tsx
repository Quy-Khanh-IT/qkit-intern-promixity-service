import React, { useEffect, useMemo, useState } from 'react'
import './review.scss'
import StarProgressBar from './components/StarProgressBar'
import { IBusiness } from '@/types/business'
import ReviewList from './components/ReviewList'
import { Image, Modal, Rate, Select } from 'antd'
import { useAuth } from '@/context/AuthContext'
import { ToastService } from '@/services/toast.service'
import { useCreateReviewMutation, useGetEmotionsQuery } from '@/services/review.service'
import { ICreateReviewPayload } from '@/types/review'

export default function Review({
  business,
  handleChangeFetch
}: {
  business: IBusiness
  handleChangeFetch: (value: boolean) => void
}): React.ReactNode {
  const rating = business.overallRating
  const totalReview = business.totalReview

  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  const toastService = useMemo<ToastService>(() => new ToastService(), [])

  const { userInformation } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [reviewText, setReviewText] = useState<string>('')
  const [ratingValue, setRatingValue] = useState<number>(0)
  const [emotionValue, setEmotionValue] = useState<string>('')

  const [createReview, { isSuccess: isCreatedSuccess, isError: isCreatedError }] = useCreateReviewMutation()

  const showModal = (): void => {
    if (!(userInformation && userInformation.isVerified)) {
      toastService.error('You must login to review this business')
    } else {
      setIsModalOpen(true)
    }
  }

  const { data: emotions } = useGetEmotionsQuery()

  const handleOk = (): void => {
    if (ratingValue < 1 && emotionValue === '') {
      toastService.error('Please rate this business')
    } else {
      if (reviewText) {
        const payload: ICreateReviewPayload = {
          businessId: business.id,
          content: reviewText,
          star: ratingValue.toString(),
          emotion: emotionValue
        }

        createReview(payload)
      } else {
        toastService.error('Please enter a review')
      }
    }
  }

  useEffect(() => {
    if (isCreatedSuccess) {
      toastService.success('Review created successfully')
      setIsModalOpen(false)
      setReviewText('')
      setRatingValue(0)
      setEmotionValue('')
      handleChangeFetch(true)
    } else if (isCreatedError) {
      toastService.error('Review failed to create')
    }
  }, [isCreatedSuccess, isCreatedError])

  const handleCancel = (): void => {
    setIsModalOpen(false)
  }

  const emotionOptions = Object.entries(emotions || {}).map(([label, value]) => {
    let color
    switch (value) {
      case 'EXCELLENT':
        color = '#28a745'
        break
      case 'GOOD':
        color = '#17a2b8'
        break
      case 'NORMAL':
        color = '#ffc107'
        break
      case 'BAD':
        color = '#dc3545'
        break
      default:
        color = '#000000'
    }

    return { value, label, color }
  })

  const handleChangeEmotion = (value: string): void => {
    setEmotionValue(value)
  }

  console.log(emotionValue)
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
          <div onClick={showModal} className='send-review-btn p-1 d-flex align-items-center justify-content-center'>
            <i className='fa-regular fa-comment-dots me-2'></i>
            Write a review
          </div>
        </div>
      </div>

      <div className='review-list-container'>
        <ReviewList businessId={business.id} />
      </div>

      {/* Modal write a review */}
      <Modal okText='Post' open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div className='review-business-name text-center mb-3'>{business.name}</div>
        {userInformation && userInformation.isVerified && (
          <div className='user-info d-flex align-items-center '>
            <div className='user-avatar mb-2'>
              <Image
                preview={false}
                height={40}
                width={40}
                alt='user-avatar'
                src={userInformation.image}
                fallback='https://raw.githubusercontent.com/ninehcobra/free-host-image/main/News/logo.png'
              />
            </div>
            <div className='user-name ms-2'>{`${userInformation.lastName} ${userInformation.firstName}`}</div>
          </div>
        )}

        <div className='d-flex align-items-center justify-content-center mt-2 mb-1'>
          <Rate value={ratingValue} onChange={(value) => setRatingValue(value)} />
        </div>
        {emotions && emotionOptions.length > 0 ? (
          <div className='d-flex align-items-center mt-3 mb-1'>
            <div>Your experience here:</div>
            <Select
              onChange={handleChangeEmotion}
              className='ms-2'
              style={{ width: 140 }}
              options={emotionOptions}
            ></Select>
          </div>
        ) : (
          ''
        )}
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className='p-3 review-text-area w-100 mt-3'
          placeholder='Share details of your own experience at this place'
        ></textarea>
      </Modal>
    </div>
  )
}

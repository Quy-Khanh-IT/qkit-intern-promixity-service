'use client'
import React, { useEffect, useState } from 'react'
import './review-list.scss'
import { useGetReviewsForBusinessQuery } from '@/services/review.service'
import { Dropdown, MenuProps, Skeleton, Space } from 'antd'
import ReviewItem from './ReviewItem'
import { useAuth } from '@/context/AuthContext'

export default function ReviewList({ businessId }: { businessId: string }): React.ReactNode {
  const [sortBy, setSortBy] = useState<string>('desc')
  const { data, isLoading, isFetching } = useGetReviewsForBusinessQuery({
    businessId,
    sortBy
  })

  const [showReviews, setShowReviews] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowReviews(true)
    }, 1000)

    return (): void => clearTimeout(timer)
  }, [])

  if (isLoading || !showReviews) {
    return (
      <div className='review-list p-3'>
        <Skeleton active avatar />
        <Skeleton active avatar />
        <Skeleton active avatar />
        <Skeleton active avatar />
        <Skeleton active avatar />
      </div>
    )
  }

  const items: MenuProps['items'] = [
    {
      label: 'Newest reviews',
      key: 'desc'
    },
    {
      label: 'Oldest reviews',
      key: 'asc'
    }
  ]

  const onClick: MenuProps['onClick'] = ({ key }) => {
    setSortBy(key)
  }

  const listReview = data?.data
  console.log(listReview)

  return (
    <div className='review-list'>
      <div className='sort-wrapper pt-2 pe-3 ps-3 d-flex align-items-center justify-content-between'>
        <div></div>
        <Dropdown menu={{ items, onClick }} trigger={['click']}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <div className='sort-btn d-flex align-items-center justify-content-center'>
                <i className='fa-solid fa-filter me-2'></i>
                <div className='btn-title'>Sort</div>
              </div>
            </Space>
          </a>
        </Dropdown>
      </div>
      {listReview && listReview?.length > 0 ? (
        listReview.map((review, index) => (
          <div key={index}>
            <ReviewItem review={review} />
          </div>
        ))
      ) : (
        <div>There are no reviews yet.</div>
      )}
    </div>
  )
}

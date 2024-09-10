'use client'
import ImageCustom from '@/app/components/ImageCustom/ImageCustom'
import AdminReview from '@/app/components/Review/AdminReview'
import { useGetReviewsByIdQuery } from '@/services/review.service'
import { getTimeHistory } from '@/utils/helpers.util'
import { Button, Card, Col, Flex, Row, Space, Typography } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import './review-details.scss'

const { Text, Title } = Typography

const ReviewDetails = (): React.ReactNode => {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const { data: reviewData } = useGetReviewsByIdQuery(params.slug)

  return (
    <div>
      <Row>
        <Col span={24} style={{ height: 36 }}>
          <Button icon={<i className='fa-solid fa-arrow-left'></i>} onClick={() => router.back()} className='h-100'>
            Back
          </Button>
        </Col>
        <Col span={24} className='--review-details-cover d-flex justify-content-center mt-3 scroll-bar-2'>
          <div style={{ width: '70%' }} className='--content-details'>
            <Col span={24}>
              <Card className='shadow-3-down'>
                <Flex>
                  <div>
                    <ImageCustom
                      width={65}
                      height={65}
                      src={reviewData?.postBy.avatarUrl}
                      className='d-flex align-self-center'
                    />
                  </div>
                  <Flex className='ms-3' vertical>
                    <Space className='w-100'>
                      <Title level={5} className='mb-0'>
                        {reviewData?.postBy.firstName} {reviewData?.postBy?.lastName}
                      </Title>
                      <Text>{getTimeHistory(reviewData?.created_at || '')}</Text>
                    </Space>
                    <Text>{reviewData?.content}</Text>
                  </Flex>
                </Flex>
              </Card>
            </Col>

            {reviewData?.reply && reviewData.reply?.data && reviewData.reply.data.length > 0 && (
              <div className='pb-3'>
                {reviewData.reply.data.length === 1 ? (
                  <div className='split-review-section'>
                    <AdminReview data={reviewData.reply.data} offsetNumber={2} />
                  </div>
                ) : (
                  <AdminReview data={reviewData.reply.data} offsetNumber={2} />
                )}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default ReviewDetails

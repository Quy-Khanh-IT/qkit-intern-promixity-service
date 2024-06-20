'use client'
import ImageCustom from '@/app/components/ImageCustom/ImageCustom'
import { Button, Card, Col, Flex, Row, Space, Typography } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import './review-details.scss'
import jsonData from './test.json'
import { IReview } from '@/types/review'
import { getTimeHistory } from '@/utils/helpers.util'
import AdminReview from '@/app/components/Review/AdminReview'

const { Text, Title } = Typography

const ReviewDetails = (): React.ReactNode => {
  const router = useRouter()
  const reviewsData: IReview = jsonData
  const params = useParams<{ slug: string }>()

  useEffect(() => {
    console.log('reviewsData', reviewsData)
  })

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
                      src={reviewsData.postBy.avatarUrl}
                      className='d-flex align-self-center'
                    />
                  </div>
                  <Flex className='ms-3' vertical>
                    <Space className='w-100'>
                      <Title level={5} className='mb-0'>
                        {reviewsData.postBy.firstName}
                      </Title>
                      <Text>{getTimeHistory(reviewsData.created_at)}</Text>
                    </Space>
                    <Text>{reviewsData.content}</Text>
                  </Flex>
                </Flex>
              </Card>
            </Col>

            {reviewsData?.reply && reviewsData.reply?.data && reviewsData.reply.data.length > 0 && (
              <AdminReview data={reviewsData.reply.data} offsetNumber={2} />
            )}
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default ReviewDetails

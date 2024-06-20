import { IReply, IReplyReply } from '@/types/review'
import React from 'react'
import ImageCustom from '../ImageCustom/ImageCustom'
import { Col, Card, Flex, Space, Typography } from 'antd'
import { getTimeHistory } from '@/utils/helpers.util'

const { Text, Title } = Typography

interface IAdminReviewProps {
  data: IReply[] | IReplyReply[]
  offsetNumber: number
}

const AdminReview: React.FC<IAdminReviewProps> = ({ data, offsetNumber }) => {
  const _offsetCoreNumber = offsetNumber > 6 ? 6 : offsetNumber

  return (
    <>
      {data.map((item: IReply | IReplyReply) => {
        return (
          <>
            <Col span={24 - _offsetCoreNumber} push={_offsetCoreNumber} key={item.id}>
              <Card className='shadow-3-down'>
                <Flex>
                  <div>
                    <ImageCustom
                      width={65}
                      height={65}
                      src={item?.postBy?.avatarUrl}
                      className='d-flex align-self-center'
                    />
                  </div>
                  <Flex className='ms-3' vertical>
                    <Space className='w-100'>
                      <Title level={5} className='mb-0'>
                        {item?.postBy?.firstName}
                      </Title>
                      <Text>{getTimeHistory(item?.created_at || '')}</Text>
                    </Space>
                    <Text>{item?.content}</Text>
                  </Flex>
                </Flex>
              </Card>
            </Col>

            {item?.replies && item.replies.length > 0 && (
              <AdminReview data={item.replies} offsetNumber={offsetNumber + 2} />
            )}
          </>
        )
      })}
    </>
  )
}

export default AdminReview

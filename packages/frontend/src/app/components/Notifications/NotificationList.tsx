import './notification-list.scss'
import { Button, Flex, List, Typography } from 'antd'
import React from 'react'
import NotificationItem from './NotificationItem'
import { INotification } from '@/types/notification'
import { UI_TEXT } from '@/constants'

const { Text } = Typography

export interface INotificationListProps {
  initLoading: boolean
  loading: boolean
  loadMoreFull: boolean
  list: INotification[]
  onLoadMore?: () => void
  setOpenModal: (_value: boolean) => void
}

const NotificationList: React.FC<INotificationListProps> = ({
  initLoading,
  loading,
  onLoadMore,
  list,
  loadMoreFull,
  setOpenModal
}) => {
  const loadMore =
    !initLoading && !loading && loadMoreFull ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px'
        }}
      >
        <Button onClick={onLoadMore} style={{ outlineColor: 'red' }} className='btn-negative'>
          Tải thêm
        </Button>
      </div>
    ) : null

  return (
    <>
      <List
        className='notification-item-list'
        loading={initLoading}
        itemLayout='horizontal'
        loadMore={loadMore}
        dataSource={list}
        renderItem={(item) => <NotificationItem data={item} loading={loading} setOpenModal={setOpenModal} />}
      />
      <Flex justify='center' style={{ marginTop: 32, marginBottom: 32 }}>
        <Text type='secondary'>{UI_TEXT.DELETED_PERIOD}</Text>
      </Flex>
    </>
  )
}

export default NotificationList

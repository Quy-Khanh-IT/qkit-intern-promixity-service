import { INotification } from '@/types/notification'
import { convertNotificationType, getTimeHistory } from '@/utils/helpers.util'
import { UserOutlined } from '@ant-design/icons'
import { Avatar, List, Skeleton, Space, Typography } from 'antd'
import React from 'react'
import variables from '@/sass/common/_variables.module.scss'
import { useRouter } from 'next/navigation'
import { useUpdateReadNotificationMutation } from '@/services/notification.service'
import { ROUTE } from '@/constants'
import { RoleEnum } from '@/types/enum'

const { mainColor } = variables

export interface INotificationItemProps {
  data: INotification
  loading: boolean
  setOpenModal: (_value: boolean) => void
}

const NotificationItem: React.FC<INotificationItemProps> = ({ data, loading, setOpenModal }) => {
  const router = useRouter()
  const [updateReadNotification] = useUpdateReadNotificationMutation()

  const updateReadBtn = async (): Promise<void> => {
    await updateReadNotification(data.id)
  }

  const handleClickItem = (e: React.MouseEvent<HTMLElement>): void => {
    const splitType = data.type.split('_')
    if (splitType[splitType.length - 1] === (RoleEnum._USER as string)) {
      router.push(ROUTE.MANAGE_USER)
    } else if (splitType[splitType.length - 1] === (RoleEnum._BUSINESS as string)) {
      router.push(ROUTE.MANAGE_BUSINESS)
    }
    const iTag = e.currentTarget.querySelector('.ant-list-item-action .read-btn')
    if (iTag) {
      updateReadBtn()
      iTag.classList.add('d-none')
    }
    setOpenModal(false)
  }

  return (
    <List.Item
      actions={[
        !data.isRead && (
          <i className='fa-sharp fa-solid fa-circle read-btn' style={{ fontSize: 7, color: mainColor }}></i>
        )
      ]}
      className={`notification-item ${'item-' + data.id}`}
      onClick={handleClickItem}
    >
      <Skeleton avatar title={false} loading={loading} active>
        <List.Item.Meta
          avatar={<Avatar size={40} icon={<UserOutlined />} style={{ marginTop: '2px' }} />}
          title={
            <>
              <Space direction='horizontal'>
                <Typography.Text>{data.title}</Typography.Text>
                <Typography.Text type='secondary' style={{ fontWeight: 400 }}>
                  {getTimeHistory(data.created_at)}
                </Typography.Text>
              </Space>
            </>
          }
          description={
            <Space direction='vertical'>
              <Typography.Text>{data.content}</Typography.Text>
              <Typography.Text type='secondary' style={{ fontSize: 12 }}>
                {convertNotificationType(data.type)}
              </Typography.Text>
            </Space>
          }
        />
      </Skeleton>
    </List.Item>
  )
}

export default NotificationItem

import { INotification } from '@/types/notification'
import { convertNotificationType, getTimeHistory } from '@/utils/helpers.util'
import { UserOutlined } from '@ant-design/icons'
import { Avatar, List, Skeleton, Space, Typography } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import variables from '@/sass/common/_variables.module.scss'

const { mainColor } = variables

export interface INotificationItemProps {
  data: INotification
  loading: boolean
  setOpenModal: (_value: boolean) => void
}

const NotificationItem: React.FC<INotificationItemProps> = ({ data, loading, setOpenModal }) => {
  // const navigate = useNavigate()
  // const [updateReadNotification] = useUpdateReadNotificationMutation()

  // const updateReadBtn = async () => {
  //   await updateReadNotification(data.id)
  // }

  // const handleClickItem = (e: React.MouseEvent<HTMLElement>) => {
  //   const splitType = data.type.split('_')
  //   if (splitType[splitType.length - 1] === 'USER') {
  //     navigate(ROUTE.MANAGE_USER)
  //   } else if (splitType[splitType.length - 1] === 'FORM') {
  //     navigate(ROUTE.MANAGE_FORM)
  //   } else if (splitType[splitType.length - 1] === 'DATA') {
  //     navigate(ROUTE.MANAGE_DATA)
  //   }
  //   const iTag = e.currentTarget.querySelector('.ant-list-item-action .read-btn')
  //   if (iTag) {
  //     updateReadBtn()
  //     iTag.classList.add('d-none')
  //   }
  //   setOpenModal(false)
  // }

  // const getDescription = () => {
  //   if (
  //     [
  //       NotificationType._CREATE_USER,
  //       NotificationType._UPDATE_USER,
  //       NotificationType._DElETE_USER,
  //       NotificationType._RESTORE_USER
  //     ].includes(data.type as NotificationType)
  //   ) {
  //     return `${data.description} ${(data.metadata as UserMetadata)?.fullName}`
  //   } else if (
  //     [
  //       NotificationType._CREATE_FORM,
  //       NotificationType._CREATE_FORM_QUESTION,
  //       NotificationType._UPDATE_FORM,
  //       NotificationType._UPDATE_FORM_QUESTION,
  //       NotificationType._DELETE_FORM,
  //       NotificationType._ACCEPT_FORM,
  //       NotificationType._CANCEL_FORM,
  //       NotificationType._REJECT_FORM,
  //       NotificationType._CLOSE_FORM,
  //       NotificationType._RESTORE_FORM
  //     ].includes(data.type as NotificationType)
  //   ) {
  //     return <div dangerouslySetInnerHTML={{ __html: `${data.description} ${data.title}` }} />
  //   } else {
  //     return data.description
  //   }
  // }

  return (
    <List.Item
      actions={[
        !data.isRead && (
          <i className='fa-sharp fa-solid fa-circle read-btn' style={{ fontSize: 7, color: mainColor }}></i>
        )
      ]}
      className={`notification-item ${'item-' + data.id}`}
      // onClick={handleClickItem}
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

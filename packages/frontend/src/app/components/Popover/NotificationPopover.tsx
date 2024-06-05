import { NotificationOutlined } from '@ant-design/icons'
import { Badge, Flex, Popover, Space, Tabs, TabsProps, Tooltip } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import StickyBox from 'react-sticky-box'
import { toast } from 'react-toastify'

import { useLazyGetAllNotificationsQuery } from '@/services/notification.service'
import { INotification } from '@/types/notification'
import NotificationList from '../Notifications/NotificationList'
import './notification-popover.scss'
import { BellOutlined } from '@ant-design/icons'
import { IGetAllNotificationQuery } from '@/types/query'
import { UI_TEXT } from '@/constants'
import { IPaginationResponse } from '@/types/pagination'
import { BooleanEnum } from '@/types/enum'

const ORIGIN_PAGE = 1
const PAGE_SIZE = 4
const ORIGIN_TAB = '0'
const TAB_STEPS = {
  ALL: ORIGIN_TAB,
  UNREAD: '1',
  READ: '2'
}
const firstPayload = { offset: ORIGIN_PAGE, limit: PAGE_SIZE } as IGetAllNotificationQuery

const tabTitle = [
  <span key='all' className='tab-hover'>
    Everything
  </span>,
  <span key='unread' className='tab-hover'>
    Unread
  </span>,
  <span key='read' className='tab-hover'>
    Read
  </span>
]

const NotificationPopover = (): React.ReactNode => {
  const perPage = useRef<number>(PAGE_SIZE)
  const [initLoading, setInitLoading] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadMoreFull, setLoadMoreFull] = useState<boolean>(false)
  const tabKeyRef = useRef<string>(ORIGIN_TAB)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [cacheData, setCacheData] = useState<INotification[]>([])
  const [notificationsData, setNotificationsData] = useState<INotification[]>([])
  const [itemCount, setItemCount] = useState<number>(0)
  const [getAllNotifications] = useLazyGetAllNotificationsQuery()

  // const fetchAllRead = async () => {
  //   await updateAllReadNotification().unwrap().then()
  // }

  const clickAllRead = (e: React.MouseEvent<HTMLSpanElement>): void => {
    // fetchAllRead()
    const allReadBtn = document.querySelectorAll('.ant-list-item-action .read-btn')
    allReadBtn.forEach((item: Element) => {
      console.log(item)
      item.classList.add('d-none')
    })
    ;(e.currentTarget as HTMLElement).remove()
  }

  const text = (
    <Flex justify='space-between' align='center' style={{ marginBottom: 0 }}>
      <span style={{ fontSize: 20 }}>Notifications</span>
      <span id='all-read-btn' onClick={clickAllRead}>
        {UI_TEXT.MARK_ALL_READ}
      </span>
    </Flex>
  )

  const fetchNotifications = async (page: number, take: number): Promise<IPaginationResponse<INotification>> => {
    const payload = {
      offset: page,
      limit: take
    } as IGetAllNotificationQuery
    }

    if (tabKeyRef.current === TAB_STEPS.UNREAD) {
      payload.isRead = BooleanEnum._TRUE
    } else if (tabKeyRef.current === TAB_STEPS.READ) {
      payload.isRead = BooleanEnum._FALSE
    }
    const notificationData = await getAllNotifications(payload).unwrap();
    return notificationData;
  }

  // const onLoadMore = async () => {
  //   setLoading(true)
  //   perPage.current = perPage.current + PAGE_SIZE
  //   const notificationData = await getFetchData(perPage.current / PAGE_SIZE, PAGE_SIZE)
  //   const newData = data.concat(notificationData.items)
  //   if (notificationData.items.length === 0) {
  //     setLoadMoreFull(true)
  //   }
  //   setData(newData)
  //   setList(newData)
  //   setLoading(false)

  //   window.dispatchEvent(new Event('resize'))
  // }

  // const onLoadInterval = async () => {
  //   setLoading(true)
  //   const notificationData = await getFetchData(ORIGIN_PAGE, perPage.current)
  //   setData(notificationData.items)
  //   setList(notificationData.items)

  //   window.dispatchEvent(new Event('resize'))
  // }

  const items = tabTitle.map((item, i) => {
    return {
      label: item,
      key: i.toString(),
      children: (
        <NotificationList
          initLoading={initLoading}
          loading={loading}
          list={notificationsData}
          // onLoadMore={onLoadMore}
          loadMoreFull={loadMoreFull}
          setOpenModal={setOpenModal}
        />
      ),
      forceRender: true,
      style: { minHeight: 700, textColor: '#228154' }
    }
  })

  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
    <StickyBox offsetTop={0} offsetBottom={10} style={{ zIndex: 1, backgroundColor: 'white' }}>
      <DefaultTabBar {...props} style={{ padding: '6px 0 8px', marginBottom: 8 }} />
    </StickyBox>
  )

  const content = (
    <Tabs
      activeKey={tabKeyRef.current}
      onChange={(key) => {
        tabKeyRef.current = key
        onClose(false)
      }}
      className='tab-list'
      renderTabBar={renderTabBar}
      items={items}
      style={{ borderRadius: 16 }}
    />
  )
  const loadFirstNotifications = async (payload: IGetAllNotificationQuery): Promise<void> => {
    setLoading(true)
    await getAllNotifications(payload)
      .unwrap()
      .then((res) => {
        setInitLoading(false)
        if (res.data.length === 0) {
          setLoadMoreFull(false)
        }
        setCacheData(res.data)
        setNotificationsData(res.data)
        setItemCount(res.totalRecords)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadFirstNotifications(firstPayload)
    const timer = setInterval(() => {
      // onLoadInterval()
    }, 60000)

    return (): void => {
      clearInterval(timer)
    }
  }, [])

  const onClose = (setTabKeyBool: boolean = true): void => {
    if (setTabKeyBool) {
      tabKeyRef.current = ORIGIN_TAB
    }
    loadFirstNotifications(firstPayload)
    setLoadMoreFull(true)
    perPage.current = PAGE_SIZE

    const popoverElement = document.querySelector('.ant-popover') as HTMLElement
    if (popoverElement) {
      setTimeout(() => {
        popoverElement.scrollTop = 0
      }, 200)
    }
  }

  return (
    <>
      <div className='--notification-dropdown'>
        <Flex style={{ marginRight: 20, marginTop: 20, marginBottom: 20, borderRadius: 16 }}>
          <Popover
            placement='bottomRight'
            title={text}
            content={content}
            arrowContent={null}
            trigger='click'
            overlayStyle={{
              width: '500px',
              maxHeight: '700px',
              overflow: 'auto',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            className='--popover-notification'
            open={openModal}
            onOpenChange={(visible) => {
              if (visible) {
                setOpenModal(true)
              } else {
                setOpenModal(false)
                onClose()
              }
            }}
          >
            <Space size='large'>
              <Tooltip title='Notifications'>
                <Badge count={itemCount} offset={[-6, 5]} className='--notification-badge'>
                  <BellOutlined style={{ fontSize: 24 }} className='action-button' />
                </Badge>
              </Tooltip>
            </Space>
          </Popover>
        </Flex>
      </div>
    </>
  )
}

export default NotificationPopover

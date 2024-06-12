import { UI_TEXT } from '@/constants'
import { fetchVersionOptions } from '@/constants/rtk-query'
import variables from '@/sass/common/_variables.module.scss'
import {
  useGetNotificationsQuantityQuery,
  useLazyGetAllNotificationsQuery,
  useUpdateAllReadNotificationMutation
} from '@/services/notification.service'
import { BooleanEnum, SortEnum } from '@/types/enum'
import { INotification } from '@/types/notification'
import { IGetAllNotificationQuery } from '@/types/query'
import { BellOutlined } from '@ant-design/icons'
import { Badge, Flex, Popover, Space, Tabs, TabsProps, Tooltip } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import StickyBox from 'react-sticky-box'
import NotificationList from '../Notifications/NotificationList'
import './notification-popover.scss'

const { black } = variables

const ORIGIN_PAGE = 1
const PAGE_SIZE = 4
const ORIGIN_TAB = '0'
const TAB_STEPS = {
  ALL: ORIGIN_TAB,
  UNREAD: '1',
  READ: '2'
}
const INTERVAL_FETCH_DATA = 20000

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
  const [loadMoreFull, setLoadMoreFull] = useState<boolean>(true)
  const tabKeyRef = useRef<string>(ORIGIN_TAB)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [cacheData, setCacheData] = useState<INotification[]>([])
  const [notificationsData, setNotificationsData] = useState<INotification[]>([])
  const [itemCount, setItemCount] = useState<number>(0)
  const [getAllNotifications] = useLazyGetAllNotificationsQuery(fetchVersionOptions)
  const { data: notificationsQuantity } = useGetNotificationsQuantityQuery('object', fetchVersionOptions)
  const [updateAllReadNotification] = useUpdateAllReadNotificationMutation()

  const fetchAllRead = async (): Promise<void> => {
    await updateAllReadNotification()
  }

  const clickAllRead = (e: React.MouseEvent<HTMLSpanElement>): void => {
    fetchAllRead()
    setItemCount(0)
    loadFirstNotifications(getTabPayload())
    const allReadBtn = document.querySelectorAll('.ant-list-item-action .read-btn')
    allReadBtn.forEach((item: Element) => {
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

  const getTabPayload = (
    offset: number = ORIGIN_PAGE,
    limit: number = perPage.current,
    sortBy: SortEnum = SortEnum._DESC
  ): IGetAllNotificationQuery => {
    const payload = {
      offset,
      limit,
      sortBy
    } as IGetAllNotificationQuery

    if (tabKeyRef.current === TAB_STEPS.UNREAD) {
      payload.isRead = BooleanEnum._FALSE
    } else if (tabKeyRef.current === TAB_STEPS.READ) {
      payload.isRead = BooleanEnum._TRUE
    }

    return payload
  }

  // load first and change tab, fetch interval tab
  const loadFirstNotifications = async (payload: IGetAllNotificationQuery): Promise<void> => {
    setLoading(true)
    await getAllNotifications(payload)
      .unwrap()
      .then((res) => {
        setInitLoading(false)
        if (res.data.length === 0 || res.totalRecords <= perPage.current) {
          setLoadMoreFull(false)
        }
        setNotificationsData(res.data)
        setCacheData(res.data)
        setLoading(false)
      })
  }

  const fetchMoreNotifications = async (payload: IGetAllNotificationQuery): Promise<void> => {
    await getAllNotifications(payload)
      .unwrap()
      .then((res) => {
        const newData = cacheData.concat(res.data)
        setNotificationsData(newData)
        setCacheData(newData)
        if (res.totalRecords <= perPage.current) {
          setLoadMoreFull(false)
        }
        setLoading(false)
      })
  }

  const onLoadMore = async (): Promise<void> => {
    setLoading(true)
    perPage.current = perPage.current + PAGE_SIZE
    await fetchMoreNotifications(getTabPayload(perPage.current / PAGE_SIZE, PAGE_SIZE))

    window.dispatchEvent(new Event('resize'))
  }

  const items = tabTitle.map((item, i) => {
    return {
      label: item,
      key: i.toString(),
      children: (
        <NotificationList
          initLoading={initLoading}
          loading={loading}
          list={notificationsData}
          onLoadMore={onLoadMore}
          loadMoreFull={loadMoreFull}
          setOpenModal={setOpenModal}
        />
      ),
      forceRender: true,
      style: { minHeight: 700, textColor: black }
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

  useEffect(() => {
    setItemCount(notificationsQuantity || 0)
  }, [notificationsQuantity])

  useEffect(() => {
    loadFirstNotifications(getTabPayload())
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      loadFirstNotifications(getTabPayload())
    }, INTERVAL_FETCH_DATA)

    return (): void => {
      clearTimeout(timer)
    }
  }, [])

  const resetValues = (): void => {
    setLoadMoreFull(true)
    perPage.current = PAGE_SIZE
  }

  const onClose = (setTabKeyBool: boolean = true): void => {
    if (setTabKeyBool) {
      tabKeyRef.current = ORIGIN_TAB
    }

    resetValues()
    loadFirstNotifications(getTabPayload())

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
                onClose(true)
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

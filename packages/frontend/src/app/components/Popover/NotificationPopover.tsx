// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/exhaustive-deps */
// import '~/sass/Notifications/notification-dropdown.scss'

// import { NotificationOutlined } from '@ant-design/icons'
// import { Badge, Flex, Popover, Space, Tabs, TabsProps } from 'antd'
// import React, { useEffect, useRef, useState } from 'react'
// import StickyBox from 'react-sticky-box'
// import { toast } from 'react-toastify'

// import {
//   useLazyGetAllNotificationsQuery,
//   useLazyGetAllReadNotificationsQuery,
//   useLazyGetAllUnReadNotificationsQuery,
//   useUpdateAllReadNotificationMutation
// } from '~/services/notification.service'
// import { IPaginationResponse } from '~/types/base'
// import { INotification } from '~/types/notification'

// import NotificationList from '../Notifications/NotificationList'

// const tabTitle = [
//   <span className='tab-hover'>Tất cả</span>,
//   <span className='tab-hover'>Chưa đọc</span>,
//   <span className='tab-hover'>Đã đọc</span>
// ]

// const NotificationDropdown = () => {
//   const currentPageConst = 1
//   const perPageConst = 4
//   const perPage = useRef(perPageConst)
//   const [initLoading, setInitLoading] = useState(true)
//   const [loading, setLoading] = useState(false)
//   const [loadMoreFull, setLoadMoreFull] = useState(false)
//   const tabKeyRef = useRef('0')
//   const [openModal, setOpenModal] = useState(false)
//   const [data, setData] = useState<INotification[]>([])
//   const [list, setList] = useState<INotification[]>([])
//   const [itemCount, setItemCount] = useState(0)
//   const [updateAllReadNotification] = useUpdateAllReadNotificationMutation()
//   const [getAllNotifications] = useLazyGetAllNotificationsQuery()
//   const [getAllReadNotifications] = useLazyGetAllReadNotificationsQuery()
//   const [getAllUnReadNotifications] = useLazyGetAllUnReadNotificationsQuery()

//   const fetchAllRead = async () => {
//     await updateAllReadNotification().unwrap().then()
//   }

//   const clickAllRead = async (e: React.MouseEvent<HTMLSpanElement>) => {
//     fetchAllRead()
//     const allReadBtn = document.querySelectorAll('.ant-list-item-action .read-btn')
//     allReadBtn.forEach((item: Element) => {
//       console.log(item)
//       item.classList.add('d-none')
//     })
//     ;(e.currentTarget as HTMLElement).remove()
//   }

//   const text = (
//     <Flex justify='space-between' align='center' style={{ marginBottom: 0 }}>
//       <span style={{ fontSize: '18px' }}>Notifications</span>
//       <span id='all-read-btn' onClick={clickAllRead}>
//         Đánh dấu đã đọc hết
//       </span>
//     </Flex>
//   )

//   const getFetchData = async (page: number, take: number) => {
//     let notificationData: IPaginationResponse<INotification> = {
//       page: 1,
//       take: 6,
//       items: [],
//       itemCount: 0,
//       pageCount: 0,
//       hasNextPage: true,
//       hasPreviousPage: false
//     }
//     if (tabKeyRef.current === '0') {
//       await getAllNotifications({ page, take })
//         .unwrap()
//         .then((res) => {
//           notificationData = res
//         })
//     } else if (tabKeyRef.current === '1') {
//       await getAllUnReadNotifications({ page, take })
//         .unwrap()
//         .then((res) => {
//           notificationData = res
//         })
//     } else if (tabKeyRef.current === '2') {
//       await getAllReadNotifications({ page, take })
//         .unwrap()
//         .then((res) => {
//           notificationData = res
//         })
//     }
//     return notificationData
//   }

//   const onLoadMore = async () => {
//     setLoading(true)
//     perPage.current = perPage.current + perPageConst
//     const notificationData = await getFetchData(perPage.current / perPageConst, perPageConst)
//     const newData = data.concat(notificationData.items)
//     if (notificationData.items.length === 0) {
//       setLoadMoreFull(true)
//     }
//     setData(newData)
//     setList(newData)
//     setLoading(false)

//     window.dispatchEvent(new Event('resize'))
//   }

//   const onLoadInterval = async () => {
//     setLoading(true)
//     const notificationData = await getFetchData(currentPageConst, perPage.current)
//     setData(notificationData.items)
//     setList(notificationData.items)

//     window.dispatchEvent(new Event('resize'))
//   }

//   const items = tabTitle.map((item, i) => {
//     return {
//       label: item,
//       key: i.toString(),
//       children: (
//         <NotificationList
//           initLoading={initLoading}
//           loading={loading}
//           list={list}
//           onLoadMore={onLoadMore}
//           loadMoreFull={loadMoreFull}
//           setOpenModal={setOpenModal}
//         />
//       ),
//       forceRender: true,
//       style: { minHeight: 700, textColor: '#228154' }
//     }
//   })

//   const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
//     <StickyBox offsetTop={0} offsetBottom={10} style={{ zIndex: 1, backgroundColor: 'white' }}>
//       <DefaultTabBar {...props} style={{ padding: '6px 0 8px', marginBottom: 8 }} />
//     </StickyBox>
//   )

//   const content = (
//     <Tabs
//       activeKey={tabKeyRef.current}
//       onChange={(key) => {
//         tabKeyRef.current = key
//         onClose(false)
//       }}
//       className='tab-list'
//       renderTabBar={renderTabBar}
//       items={items}
//       style={{ borderRadius: 16 }}
//     />
//   )
//   const fetchNotification = async (page: number, take: number) => {
//     setLoading(true)
//     try {
//       setInitLoading(false)
//       const notificationData = await getFetchData(page, take)
//       if (notificationData.items.length === 0) {
//         setLoadMoreFull(true)
//       }
//       setItemCount(notificationData.itemCount)
//       setData(notificationData.items)
//       setList(notificationData.items)
//       setLoading(false)
//     } catch (error: any) {
//       toast.error(error.response.data.message)
//     }
//   }

//   useEffect(() => {
//     fetchNotification(currentPageConst, perPage.current)
//     const timer = setInterval(() => {
//       onLoadInterval()
//     }, 60000)

//     return () => {
//       clearInterval(timer)
//     }
//   }, [])

//   const onClose = (setTabKeyBool: boolean = true) => {
//     if (setTabKeyBool) {
//       tabKeyRef.current = '0'
//     }
//     fetchNotification(currentPageConst, perPageConst)
//     setLoadMoreFull(false)
//     perPage.current = perPageConst

//     const popoverElement = document.querySelector('.ant-popover') as HTMLElement
//     if (popoverElement) {
//       setTimeout(() => {
//         popoverElement.scrollTop = 0
//       }, 200)
//     }
//   }

//   return (
//     <div className='--notification-dropdown'>
//       <Flex style={{ marginRight: 20, marginTop: 20, marginBottom: 20, borderRadius: 16 }}>
//         <Popover
//           placement='bottomRight'
//           title={text}
//           content={content}
//           arrowContent={null}
//           trigger='click'
//           overlayStyle={{
//             width: '500px',
//             maxHeight: '700px',
//             overflow: 'auto',
//             boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)'
//           }}
//           className='--popover-notification'
//           open={openModal}
//           onOpenChange={(visible) => {
//             if (visible) {
//               setOpenModal(true)
//             } else {
//               setOpenModal(false)
//               onClose()
//             }
//           }}
//         >
//           <Space size='large'>
//             <Badge count={itemCount} size='small' offset={[2, 5]}>
//               <NotificationOutlined
//                 style={{ fontSize: '16px', cursor: 'pointer', padding: '8px 2px' }}
//                 onClick={() => onClose()}
//               />
//             </Badge>
//           </Space>
//         </Popover>
//       </Flex>
//     </div>
//   )
// }

// export default NotificationDropdown

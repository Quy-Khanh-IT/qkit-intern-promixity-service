'use client'
import { ROUTE, StorageKey } from '@/constants'
import { useAuth } from '@/context/AuthContext'
import { useSessionStorage } from '@/hooks/useSessionStorage'
import '@/sass/common/_common.scss'
import variables from '@/sass/common/_variables.module.scss'
import { getPresentUrl } from '@/utils/helpers.util'
import { Col, Grid, MenuProps, Row, theme } from 'antd'
import { Content } from 'antd/es/layout/layout'
import { useAnimationControls } from 'framer-motion'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import './main.scss'
import MainHeader from './layouts/MainHeader'
import MainSidebar from './layouts/MainSidebar'
import { directRoutes, findKeyMenuBasedRoute, findRouteMenuBasedKey } from './utils/main.util'
import { ADMIN_SIDEBAR_OPTIONS } from './admin.constant'
import { IUserInformation } from '@/types/user'

const { useBreakpoint } = Grid
const { subColor2 } = variables

const HEADER_HEIGHT = 80

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>): React.ReactNode {
  // const router = useRouter()
  // const { userInformation } = useAuth()
  // // const [routeFlow, setRouteFlow] = useState<string>(
  // //   directRoutes(userInformation?.role, ROUTE.DASHBOARD, ROUTE.USER_PROFILE)
  // // )
  // const [collapsed, setCollapsed] = useState<boolean>(false)
  // const containerControls = useAnimationControls()
  // const contentControls = useAnimationControls()
  // const screens = useBreakpoint()

  // const [routeValue, setRouteValue, _removeRouteValue] = useSessionStorage(
  //   StorageKey._ROUTE_VALUE,
  //   // getPresentUrl() || ROUTE.DASHBOARD
  //   ROUTE.DASHBOARD
  // )

  // const [selectedMenuKey, setSelectedMenuKey] = useState(() => {
  //   // if (userInformation?.role) {
  //   //   return findKeyMenuBasedRoute(userInformation.role, routeValue) || '1'
  //   // }
  //   return '1'
  // })

  // // useEffect(() => {
  // //   const initialRouteValue = getPresentUrl() || directRoutes(userInformation?.role, ROUTE.DASHBOARD, ROUTE.USER_PROFILE) || ROUTE.USER_PROFILE
  // //   setRouteValue(initialRouteValue)
  // // }, [userInformation])

  // // useEffect(() => {
  // //   console.log('routeValue', routeValue)
  // //   if (routeValue) {
  // //     const foundKey: string = findKeyMenuBasedRoute(userInformation?.role, routeValue as string)
  // //     setSelectedMenuKey(foundKey)
  // //   }
  // // }, [routeValue])

  // useEffect(() => {
  //   if (userInformation) {
  //     const initialRouteValue = directRoutes(userInformation?.role, ROUTE.DASHBOARD, ROUTE.USER_PROFILE)
  //     setRouteValue(initialRouteValue)

  //     const initialMenuKey = findKeyMenuBasedRoute(userInformation?.role, initialRouteValue) || '1'
  //     setSelectedMenuKey(initialMenuKey)
  //   }
  // }, [userInformation])

  // const {
  //   token: { colorBgContainer }
  // } = theme.useToken()

  // useEffect(() => {
  //   Object.entries(screens)
  //     .filter((screen) => !!screen[1])
  //     .map((screen) => {
  //       if (screen[0] === 'xs' || screen[0] === 'sm') {
  //         setCollapsed(true)
  //       } else {
  //         setCollapsed(false)
  //       }
  //     })
  // }, [screens])

  // useEffect(() => {
  //   const animate = async (): Promise<void> => {
  //     if (collapsed) {
  //       await containerControls.start('close')
  //       await contentControls.start('open')
  //     } else {
  //       await containerControls.start('open')
  //       await contentControls.start('close')
  //     }
  //   }

  //   animate()
  // }, [collapsed])

  // const onMenuClick: MenuProps['onClick'] = (e) => {
  //   const routeValue = findRouteMenuBasedKey(userInformation.role, e.key)
  //   router.push(routeValue)
  //   setRouteValue(routeValue)
  //   setSelectedMenuKey(e.key)
  // }

  const router = useRouter()
  const { userInformation } = useAuth()
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const containerControls = useAnimationControls()
  const contentControls = useAnimationControls()
  const screens = useBreakpoint()

  const [routeValue, setRouteValue, _removeRouteValue] = useSessionStorage(
    StorageKey._ROUTE_VALUE,
    getPresentUrl() || ROUTE.MANAGE_USER
  )
  const [selectedMenuKey, setSelectedMenuKey] = useState<unknown>(routeValue || ADMIN_SIDEBAR_OPTIONS.DASHBOARD.key)

  useEffect(() => {
    console.log('routeValue', routeValue)
    if (routeValue) {
      if (routeValue === ROUTE.DASHBOARD) {
        setSelectedMenuKey(ADMIN_SIDEBAR_OPTIONS.DASHBOARD.key)
      } else if (routeValue === ROUTE.MANAGE_USER) {
        setSelectedMenuKey(ADMIN_SIDEBAR_OPTIONS.MANAGE_USER.key)
      } else if (routeValue === ROUTE.MANAGE_BUSINESS) {
        setSelectedMenuKey(ADMIN_SIDEBAR_OPTIONS.MANAGE_BUSINESS.key)
      } else if (routeValue === ROUTE.MANAGE_REVIEW) {
        setSelectedMenuKey(ADMIN_SIDEBAR_OPTIONS.MANAGE_REVIEW.key)
      } else {
        setSelectedMenuKey(ADMIN_SIDEBAR_OPTIONS.DASHBOARD.key)
      }
    }
  }, [routeValue])

  const {
    token: { colorBgContainer }
  } = theme.useToken()

  useEffect(() => {
    Object.entries(screens)
      .filter((screen) => !!screen[1])
      .map((screen) => {
        if (screen[0] === 'xs' || screen[0] === 'sm') {
          setCollapsed(true)
        } else {
          setCollapsed(false)
        }
      })
  }, [screens])

  useEffect(() => {
    const animate = async (): Promise<void> => {
      if (collapsed) {
        await containerControls.start('close')
        await contentControls.start('open')
      } else {
        await containerControls.start('open')
        await contentControls.start('close')
      }
    }

    animate()
  }, [collapsed])

  const onMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === ADMIN_SIDEBAR_OPTIONS.DASHBOARD.key) {
      router.push(ROUTE.DASHBOARD)
      setRouteValue(ROUTE.DASHBOARD)
    } else if (e.key === ADMIN_SIDEBAR_OPTIONS.MANAGE_USER.key) {
      router.push(ROUTE.MANAGE_USER)
      setRouteValue(ROUTE.MANAGE_USER)
    } else if (e.key === ADMIN_SIDEBAR_OPTIONS.MANAGE_BUSINESS.key) {
      router.push(ROUTE.MANAGE_BUSINESS)
      setRouteValue(ROUTE.MANAGE_BUSINESS)
    } else if (e.key === ADMIN_SIDEBAR_OPTIONS.MANAGE_REVIEW.key) {
      router.push(ROUTE.MANAGE_REVIEW)
      setRouteValue(ROUTE.MANAGE_REVIEW)
    }
    setSelectedMenuKey(e.key)
  }

  return (
    <Row className='--admin-layout'>
      <Col
        span={24}
        style={{
          minHeight: 'unset',
          display: 'flex',
          padding: 0,
          background: colorBgContainer,
          position: 'fixed',
          left: 0,
          right: 0,
          top: 0,
          zIndex: 99,
          height: HEADER_HEIGHT
        }}
      >
        <MainHeader collapsed={collapsed} setCollapsed={setCollapsed} setRouteValue={setRouteValue} />
      </Col>
      <Col span={24} style={{ paddingTop: HEADER_HEIGHT }}>
        <Row style={{ position: 'fixed', left: 0, right: 0, top: HEADER_HEIGHT, zIndex: 99 }}>
          <Col
            xs={collapsed ? 0 : 12}
            md={collapsed ? 0 : 6}
            lg={collapsed ? 0 : 5}
            xl={collapsed ? 0 : 4}
            className='sidebar-col h-100'
          >
            <MainSidebar
              userInformation={userInformation}
              selectedMenuKey={selectedMenuKey as string}
              handleMenuClick={onMenuClick}
            />
          </Col>
          <Col
            xs={collapsed ? 24 : 24}
            md={collapsed ? 24 : 18}
            lg={collapsed ? 24 : 19}
            xl={collapsed ? 24 : 20}
            className='content-col'
          >
            <Content
              style={{
                padding: 24,
                minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
                height: '1000px',
                backgroundColor: subColor2
              }}
            >
              <div
                style={{
                  background: colorBgContainer,
                  borderRadius: 8,
                  padding: 20,
                  // padding 24px vs 80px for header
                  height: 'calc(100vh - 80px - 48px)'
                }}
              >
                {children}
              </div>
            </Content>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

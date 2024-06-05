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
import MainHeader from './layouts/MainHeader'
import MainSidebar from './layouts/MainSidebar'
import './main.scss'
import { findKeyMenuBasedRoute, findRouteMenuBasedKey } from './utils/main.util'

const { useBreakpoint } = Grid
const { subColor2 } = variables

const HEADER_HEIGHT = 80

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>): React.ReactNode {
  const router = useRouter()
  const { userInformation } = useAuth()
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const containerControls = useAnimationControls()
  const contentControls = useAnimationControls()
  const screens = useBreakpoint()

  const [routeValue, setRouteValue, _removeRouteValue] = useSessionStorage(
    StorageKey._ROUTE_VALUE,
    getPresentUrl() || ROUTE.DASHBOARD
  )

  const [selectedMenuKey, setSelectedMenuKey] = useState<string>(
    findKeyMenuBasedRoute(userInformation?.role, routeValue as string)
  )

  useEffect(() => {
    if (userInformation) {
      const initialRouteValue = getPresentUrl()
      setRouteValue(initialRouteValue)

      const initialMenuKey = findKeyMenuBasedRoute(userInformation?.role, initialRouteValue) || '1'
      setSelectedMenuKey(initialMenuKey)
    }
  }, [userInformation])

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
    const routeValue = findRouteMenuBasedKey(userInformation?.role, e.key)
    router.push(routeValue)
    setRouteValue(routeValue)
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
              selectedMenuKey={selectedMenuKey}
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
                  height: `calc(100vh - ${HEADER_HEIGHT}px - 48px)`
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

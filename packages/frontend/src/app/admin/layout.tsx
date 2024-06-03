'use client'
import { ROUTE, StorageKey } from '@/constants'
import { useSessionStorage } from '@/hooks/useSessionStorage'
import '@/sass/common/_common.scss'
import variables from '@/sass/common/_variables.module.scss'
import { Col, Grid, MenuProps, Row, theme } from 'antd'
import { Content } from 'antd/es/layout/layout'
import { useAnimationControls } from 'framer-motion'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { SIDEBAR_MENU_OPTIONS } from './admin.constant'
import './admin.scss'
import AdminHeader from './layouts/AdminHeader'
import AdminSidebar from './layouts/AdminSidebar'

const { useBreakpoint } = Grid
const { subColor2 } = variables

const HEADER_HEIGHT = 80

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>): React.ReactNode {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const containerControls = useAnimationControls()
  const contentControls = useAnimationControls()
  const screens = useBreakpoint()

  const [routeValue, setRouteValue, _removeRouteValue] = useSessionStorage(StorageKey._ROUTE_VALUE, ROUTE.DASHBOARD)
  const [selectedMenuKey, setSelectedMenuKey] = useState<unknown>(routeValue || SIDEBAR_MENU_OPTIONS.DASHBOARD.key)

  useEffect(() => {
    if (routeValue) {
      if (routeValue === ROUTE.DASHBOARD) {
        setSelectedMenuKey(SIDEBAR_MENU_OPTIONS.DASHBOARD.key)
      } else if (routeValue === ROUTE.MANAGE_USER) {
        setSelectedMenuKey(SIDEBAR_MENU_OPTIONS.MANAGE_USER.key)
      } else if (routeValue === ROUTE.MANAGE_BUSINESS) {
        setSelectedMenuKey(SIDEBAR_MENU_OPTIONS.MANAGE_BUSINESS.key)
      } else if (routeValue === ROUTE.MANAGE_REVIEW) {
        setSelectedMenuKey(SIDEBAR_MENU_OPTIONS.MANAGE_REVIEW.key)
      } else {
        setSelectedMenuKey(SIDEBAR_MENU_OPTIONS.DASHBOARD.key)
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
    if (e.key === SIDEBAR_MENU_OPTIONS.DASHBOARD.key) {
      router.push(ROUTE.DASHBOARD)
      setRouteValue(ROUTE.DASHBOARD)
    } else if (e.key === SIDEBAR_MENU_OPTIONS.MANAGE_USER.key) {
      router.push(ROUTE.MANAGE_USER)
      setRouteValue(ROUTE.MANAGE_USER)
    } else if (e.key === SIDEBAR_MENU_OPTIONS.MANAGE_BUSINESS.key) {
      router.push(ROUTE.MANAGE_BUSINESS)
      setRouteValue(ROUTE.MANAGE_BUSINESS)
    } else if (e.key === SIDEBAR_MENU_OPTIONS.MANAGE_REVIEW.key) {
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
        <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} setRouteValue={setRouteValue} />
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
            <AdminSidebar selectedMenuKey={selectedMenuKey as string} handleMenuClick={onMenuClick} />
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

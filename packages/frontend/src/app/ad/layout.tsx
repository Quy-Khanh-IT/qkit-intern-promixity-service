/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { ROUTE } from '@/constants/route'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import '@/sass/common/_common.scss'
import variables from '@/sass/common/_variables.module.scss'
import { BellOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Col, Flex, Grid, Image, Menu, MenuProps, Row, Space, theme, Tooltip } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { useAnimationControls } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import './admin.scss'

const { useBreakpoint } = Grid

const { subColor2 } = variables
const headerHeight = 80

const _containerVariants = {
  close: {
    x: -400,
    transition: {
      type: 'spring',
      damping: 15,
      duration: 0.5,
      ease: 'easeInOut'
    }
  },
  open: {
    x: 0,
    transition: {
      // type: 'spring',
      damping: 15,
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
}

const _contentVariants = {
  close: {
    transition: {
      type: 'spring',
      damping: 15,
      duration: 0.7
    }
  },
  open: {
    transition: {
      type: 'spring',
      damping: 15,
      duration: 0.7
    }
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const containerControls = useAnimationControls()
  const contentControls = useAnimationControls()
  const screens = useBreakpoint()

  const [routeValue, setRouteValue, _removeRouteValue] = useLocalStorage('routeValue', ROUTE.MANAGE_USER)
  const [selectedMenuKey, setSelectedMenuKey] = useState<string>('')

  useEffect(() => {
    if (routeValue) {
      if (routeValue == ROUTE.MANAGE_USER) {
        setSelectedMenuKey('1')
      } else if (routeValue == ROUTE.MANAGE_BUSINESS) {
        setSelectedMenuKey('2')
      } else {
        setSelectedMenuKey('1')
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
    const animate = async () => {
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
    if (e.key === '1') {
      router.push(ROUTE.MANAGE_USER)
      setRouteValue(ROUTE.MANAGE_USER)
    } else if (e.key === '2') {
      router.push(ROUTE.MANAGE_BUSINESS)
      setRouteValue(ROUTE.MANAGE_BUSINESS)
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
          height: headerHeight
        }}
      >
        <Col xs={12} md={6} lg={5} xl={4} className='h-100 --admin-header'>
          <Header style={{ backgroundColor: colorBgContainer, padding: 0 }} className='h-100'>
            <Flex
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              className='h-100'
            >
              <Link href='/manage-user' onClick={() => setRouteValue(ROUTE.MANAGE_USER)}>
                <Image
                  src='/logo_light.png'
                  className='header-logo'
                  preview={false}
                  alt='error'
                  style={{ paddingLeft: 24 }}
                />
              </Link>
              <Button
                type='text'
                icon={
                  collapsed ? (
                    <MenuUnfoldOutlined style={{ fontSize: 20 }} />
                  ) : (
                    <MenuFoldOutlined style={{ fontSize: 20 }} />
                  )
                }
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  width: 40,
                  height: 40,
                  marginRight: 16
                }}
              />
            </Flex>
          </Header>
        </Col>

        <Col flex='auto' style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
          <Space className='me-4' size='large'>
            <Tooltip title='Notifications'>
              <Badge count={5} offset={[-6, 6]}>
                <BellOutlined style={{ fontSize: 24 }} className='action-button' />
              </Badge>
            </Tooltip>
            <Link href='/profile'>
              <Avatar icon={<UserOutlined />} className='cursor' style={{ height: 36, width: 36 }} />
            </Link>
          </Space>
        </Col>
      </Col>
      <Col span={24} style={{ paddingTop: headerHeight }}>
        <Row style={{ position: 'fixed', left: 0, right: 0, top: headerHeight, zIndex: 99 }}>
          <Col
            xs={collapsed ? 0 : 12}
            md={collapsed ? 0 : 6}
            lg={collapsed ? 0 : 5}
            xl={collapsed ? 0 : 4}
            className='sidebar-col h-100'
          >
            {/* <motion.div
              variants={containerVariants}
              animate={containerControls}
              className={`sidebar-col w-100 ${collapsed ? 'col-0' : 'col-6 col-sm-4 col-md-3 col-lg-2'}`}
            >
              
            </motion.div> */}
            <Sider
              trigger={null}
              collapsible
              // collapsed={collapsed}
              // style={{ position: 'fixed', width: '100%', background: colorBgContainer }}
              className='vh-100 h-100 --sider-admin'
              style={{ background: colorBgContainer }}
            >
              <Menu
                theme='light'
                onClick={onMenuClick}
                mode='inline'
                defaultSelectedKeys={['1']}
                selectedKeys={[selectedMenuKey]}
                className='h-100'
                items={[
                  {
                    key: '1',
                    icon: <UserOutlined />,
                    label: 'Manage user'
                  },
                  {
                    key: '2',
                    icon: (
                      <Flex style={{ width: 14, height: 16 }} justify='center'>
                        <i className='fa-light fa-building'></i>
                      </Flex>
                    ),
                    label: 'Manage business'
                  },
                  {
                    key: '3',
                    icon: <SettingOutlined />,
                    label: 'Setting'
                  }
                ]}
              />
            </Sider>
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
                minHeight: `calc(100vh - ${headerHeight}px)`,
                height: '1000px',
                backgroundColor: subColor2
              }}
              // className='h-100'
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
          {/* <motion.div
            variants={contentVariants}
            animate={contentControls}
            className={`col-12 ${collapsed ? 'col-12' : 'col-12 col-sm-12 col-md-9 col-lg-16'}`}
          >
            
          </motion.div> */}
        </Row>
      </Col>
    </Row>
  )
}

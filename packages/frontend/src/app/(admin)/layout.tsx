'use client'
import '@/sass/common/_common.scss'
import variables from '@/sass/common/_variables.module.scss'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined
} from '@ant-design/icons'
import { Button, Col, Flex, Image, Menu, Row, theme, Grid } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { motion, useAnimationControls } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import './admin.scss'

const { useBreakpoint } = Grid

const { subColor2 } = variables
const headerHeight = 80

const containerVariants = {
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

const contentVariants = {
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
  const [collapsed, setCollapsed] = useState(false)
  const containerControls = useAnimationControls()
  const contentControls = useAnimationControls()
  const screens = useBreakpoint()

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

  return (
    <Row className='--admin-layout'>
      <Col
        span={24}
        style={{
          minHeight: 'unset',
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
        <Col xs={12} md={6} lg={5} xl={4} className='h-100'>
          <Header style={{ backgroundColor: colorBgContainer }} className='--admin-header'>
            <Flex
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
                // height: headerHeight
              }}
              className='logo-section h-100 col-6 col-sm-4 col-md-3 col-lg-2'
            >
              <Image src='/logo_light.png' width={120} preview={false} alt='error' style={{ paddingLeft: 16 }} />
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
                mode='inline'
                defaultSelectedKeys={['1']}
                className='h-100'
                items={[
                  {
                    key: '1',
                    icon: <UserOutlined />,
                    label: 'nav 1'
                  },
                  {
                    key: '2',
                    icon: <VideoCameraOutlined />,
                    label: 'nav 2'
                  },
                  {
                    key: '3',
                    icon: <UploadOutlined />,
                    label: 'nav 3'
                  }
                ]}
              />
            </Sider>
          </Col>
          <Col flex='auto' className='content-col'>
            <Content
              style={{
                padding: 24,
                minHeight: `calc(100vh - ${headerHeight}px)`,
                height: '1000px',
                backgroundColor: subColor2
              }}
              // className='h-100'
            >
              <div style={{ background: colorBgContainer, borderRadius: 8, padding: 20 }}>{children}</div>
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

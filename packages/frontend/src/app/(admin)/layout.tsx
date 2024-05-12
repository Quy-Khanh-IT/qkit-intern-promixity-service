'use client'
import '@/sass/common/_common.scss'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined
} from '@ant-design/icons'
import { Button, Col, Flex, Image, Menu, Row, theme } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import React, { useEffect, useState } from 'react'
import './admin.scss'
import variables from '@/sass/common/_variables.module.scss'
import { motion, useAnimationControls } from 'framer-motion'
import { calc } from 'antd/es/theme/internal'

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

  const {
    token: { colorBgContainer }
  } = theme.useToken()

  useEffect(() => {
    if (collapsed) {
      containerControls.start('close')
      contentControls.start('open')
    } else {
      containerControls.start('open')
      contentControls.start('close')
    }
  }, [collapsed])

  return (
    <Row className='--admin-layout'>
      <Col span={24} style={{ minHeight: 'unset' }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            zIndex: 99,
            height: headerHeight
          }}
          className='--admin-header'
        >
          <Flex
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 12,
              paddingRight: 12
            }}
            className='logo-section h-100 col-6 col-sm-4 col-md-3 col-lg-2'
          >
            <Image src='/logo_light.png' width={120} preview={false} />
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
                height: 40
              }}
            />
          </Flex>
        </Header>
      </Col>
      <Col span={24} style={{ paddingTop: headerHeight }}>
        <Row style={{ position: 'fixed', left: 0, right: 0, top: headerHeight, zIndex: 99 }}>
          {/* span={collapsed ? 0 : 4} */}
          <motion.div
            variants={containerVariants}
            animate={containerControls}
            className={`sidebar-col ${collapsed ? 'col-0' : 'col-6 col-sm-4 col-md-3 col-lg-2'}`}
          >
            <Sider
              trigger={null}
              collapsible
              // collapsed={collapsed}
              // style={{ position: 'fixed', width: '100%', background: colorBgContainer }}
              className='vh-100 w-100 --sider-admin'
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
          </motion.div>
          <motion.div
            variants={contentVariants}
            animate={contentControls}
            className={`col-12 ${collapsed ? 'col-12' : 'col-12 col-sm-12 col-md-9 col-lg-10 content-col '}`}
          >
            <Content
              style={{
                padding: 24,
                minHeight: `calc(100vh - ${headerHeight}px)`,
                backgroundColor: subColor2
              }}
              className='h-100'
            >
              <div style={{ background: colorBgContainer, borderRadius: 8, padding: 20 }}>{children}</div>
            </Content>
          </motion.div>
        </Row>
      </Col>
    </Row>
  )
}

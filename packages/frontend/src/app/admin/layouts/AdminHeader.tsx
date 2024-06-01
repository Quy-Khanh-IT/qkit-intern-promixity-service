'use client'
import { ROUTE } from '@/constants'
import '@/sass/common/_common.scss'
import { BellOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Col, Flex, Image, Space, theme, Tooltip } from 'antd'
import { Header } from 'antd/es/layout/layout'
import Link from 'next/link'
import React from 'react'
import '../admin.scss'

interface IAdminHeaderProps {
  collapsed: boolean
  setCollapsed: (_collapsed: boolean) => void
  setRouteValue: (_value: string) => void
}

const AdminHeader: React.FC<IAdminHeaderProps> = ({ collapsed, setCollapsed, setRouteValue }) => {
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  return (
    <>
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
            <Link href={ROUTE.MANAGE_USER} onClick={() => setRouteValue(ROUTE.MANAGE_USER)}>
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
          <Link href={ROUTE.ADMIN_PROFILE}>
            <Avatar icon={<UserOutlined />} className='cursor' style={{ height: 36, width: 36 }} />
          </Link>
        </Space>
      </Col>
    </>
  )
}

export default AdminHeader

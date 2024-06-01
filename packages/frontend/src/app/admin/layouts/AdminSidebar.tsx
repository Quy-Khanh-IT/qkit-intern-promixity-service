'use client'
import '@/sass/common/_common.scss'
import { AreaChartOutlined, ExceptionOutlined, UserOutlined } from '@ant-design/icons'
import { Flex, Menu, MenuProps, theme } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React from 'react'
import '../admin.scss'
import { SIDEBAR_MENU_OPTIONS } from '../admin.constant'

interface IAdminSidebarProps {
  selectedMenuKey: string
  handleMenuClick: MenuProps['onClick']
}

const AdminSidebar: React.FC<IAdminSidebarProps> = ({ selectedMenuKey, handleMenuClick }) => {
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  return (
    <Sider trigger={null} collapsible className='vh-100 h-100 --sider-admin' style={{ background: colorBgContainer }}>
      <Menu
        theme='light'
        onClick={handleMenuClick}
        mode='inline'
        defaultSelectedKeys={['1']}
        selectedKeys={[selectedMenuKey]}
        className='h-100'
        items={[
          {
            ...SIDEBAR_MENU_OPTIONS.DASHBOARD,
            icon: <AreaChartOutlined />
          },
          {
            ...SIDEBAR_MENU_OPTIONS.MANAGE_USER,
            icon: <UserOutlined />
          },
          {
            ...SIDEBAR_MENU_OPTIONS.MANAGE_BUSINESS,
            icon: (
              <Flex style={{ width: 14, height: 16 }} justify='center'>
                <i className='fa-light fa-building'></i>
              </Flex>
            )
          },
          {
            ...SIDEBAR_MENU_OPTIONS.MANAGE_REVIEW,
            icon: <ExceptionOutlined />
          }
        ]}
      />
    </Sider>
  )
}

export default AdminSidebar

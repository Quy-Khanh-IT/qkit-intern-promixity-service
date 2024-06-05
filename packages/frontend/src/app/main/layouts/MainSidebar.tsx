'use client'
import '@/sass/common/_common.scss'
import { AreaChartOutlined, ExceptionOutlined, UserOutlined } from '@ant-design/icons'
import { Flex, Menu, MenuProps, theme } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React from 'react'
import '../main.scss'
import { useAuth } from '@/context/AuthContext'
import { RoleEnum } from '@/types/enum'
import { ADMIN_SIDEBAR_OPTIONS, USER_SIDEBAR_OPTIONS } from '../admin.constant'

interface IMainSidebarProps {
  selectedMenuKey: string
  handleMenuClick: MenuProps['onClick']
}

const MainSidebar: React.FC<IMainSidebarProps> = ({ selectedMenuKey, handleMenuClick }) => {
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const { userInformation } = useAuth()

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
          ...(userInformation?.role === (RoleEnum._ADMIN as string)
            ? [
                {
                  ...ADMIN_SIDEBAR_OPTIONS.DASHBOARD,
                  icon: <AreaChartOutlined />
                }
              ]
            : [
                {
                  ...USER_SIDEBAR_OPTIONS.USER_PROFILE,
                  icon: <UserOutlined />
                }
              ]),
          ...(userInformation?.role === (RoleEnum._ADMIN as string)
            ? [
                {
                  ...ADMIN_SIDEBAR_OPTIONS.MANAGE_USER,
                  icon: <UserOutlined />
                }
              ]
            : [
                {
                  ...USER_SIDEBAR_OPTIONS.MY_BUSINESS,
                  icon: (
                    <Flex style={{ width: 14, height: 16 }} justify='center'>
                      <i className='fa-light fa-building'></i>
                    </Flex>
                  )
                }
              ]),
          ...(userInformation?.role === (RoleEnum._ADMIN as string)
            ? [
                {
                  ...ADMIN_SIDEBAR_OPTIONS.MANAGE_BUSINESS,
                  icon: (
                    <Flex style={{ width: 14, height: 16 }} justify='center'>
                      <i className='fa-light fa-building'></i>
                    </Flex>
                  )
                }
              ]
            : []),
        ]}
      />
    </Sider>
  )
}

export default MainSidebar

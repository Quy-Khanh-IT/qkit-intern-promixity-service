'use client'
import '@/sass/common/_common.scss'
import { RoleEnum } from '@/types/enum'
import { IUserInformation } from '@/types/user'
import { AreaChartOutlined, UserOutlined } from '@ant-design/icons'
import { Flex, Menu, MenuProps, theme } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React, { useEffect, useState } from 'react'
import { ADMIN_SIDEBAR_OPTIONS, USER_SIDEBAR_OPTIONS } from '../admin.constant'
import '../main.scss'

interface IMainSidebarProps {
  userInformation: IUserInformation
  selectedMenuKey: string
  handleMenuClick: MenuProps['onClick']
}

const _MainSidebar: React.FC<IMainSidebarProps> = ({ userInformation, selectedMenuKey, handleMenuClick }) => {
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  const [menuItems, setMenuItems] = useState<MenuProps['items']>([])

  useEffect(() => {
    if (userInformation) {
      const items = [
        ...(userInformation.role === (RoleEnum._ADMIN as string)
          ? [
              {
                ...ADMIN_SIDEBAR_OPTIONS.DASHBOARD,
                icon: <AreaChartOutlined />
              },
              {
                ...ADMIN_SIDEBAR_OPTIONS.MANAGE_USER,
                icon: <UserOutlined />
              },
              {
                ...ADMIN_SIDEBAR_OPTIONS.MANAGE_BUSINESS,
                icon: (
                  <Flex style={{ width: 14, height: 16 }} justify='center'>
                    <i className='fa-light fa-building'></i>
                  </Flex>
                )
              }
            ]
          : [
              {
                ...USER_SIDEBAR_OPTIONS.USER_PROFILE,
                icon: <UserOutlined />
              },
              {
                ...USER_SIDEBAR_OPTIONS.MY_BUSINESS,
                icon: (
                  <Flex style={{ width: 14, height: 16 }} justify='center'>
                    <i className='fa-light fa-building'></i>
                  </Flex>
                )
              }
            ])
      ]
      setMenuItems(items)
    }
  }, [userInformation])

  return (
    <div>
      <Sider trigger={null} collapsible className='vh-100 h-100 --sider-admin' style={{ background: colorBgContainer }}>
        <Menu
          theme='light'
          onClick={handleMenuClick}
          mode='inline'
          selectedKeys={[selectedMenuKey]}
          className='h-100'
          items={menuItems}
        />
      </Sider>
    </div>
  )
}

const MainSidebar = React.memo(_MainSidebar)

export default MainSidebar

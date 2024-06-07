'use client'
import ImageCustom from '@/app/components/ImageCustom/ImageCustom'
import NotificationPopover from '@/app/components/Popover/NotificationPopover'
import { ROUTE, StorageKey } from '@/constants'
import { useAuth } from '@/context/AuthContext'
import '@/sass/common/_common.scss'
import { RoleEnum } from '@/types/enum'
import { IUserInformation } from '@/types/user'
import { getFromLocalStorage } from '@/utils/local-storage.util'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button, Col, Dropdown, Flex, Image, MenuProps, Space, theme, Typography } from 'antd'
import { Header } from 'antd/es/layout/layout'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import '../main.scss'
import { directRoutes } from '../utils/main.util'

const { Text } = Typography

interface IMainHeaderProps {
  collapsed: boolean
  setCollapsed: (_collapsed: boolean) => void
  setRouteValue: (_value: string) => void
}

const MainHeader: React.FC<IMainHeaderProps> = ({ collapsed, setCollapsed, setRouteValue }) => {
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const storedUser = getFromLocalStorage(StorageKey._USER) as IUserInformation
  const [userImage, setUserImage] = useState<string>('')
  const { onLogout, userInformation } = useAuth()

  useEffect(() => {
    if (storedUser) {
      setUserImage(storedUser.image)
    }
  }, [storedUser])

  const handleLogout = (): void => {
    onLogout()
  }

  const items: MenuProps['items'] = [
    ...(userInformation?.role === (RoleEnum._ADMIN as string)
      ? [
          {
            key: '1',
            label: (
              <Link
                href={ROUTE.ADMIN_PROFILE}
                onClick={() => setRouteValue(ROUTE.ADMIN_PROFILE)}
                className='link-underline-none'
              >
                <Text className='p-2'>Profile</Text>
              </Link>
            )
          }
        ]
      : [
          {
            key: '1',
            label: (
              <Link href={ROUTE.MAP} onClick={() => setRouteValue(ROUTE.MAP)} className='link-underline-none'>
                <Text className='p-2'>Back to map</Text>
              </Link>
            )
          }
        ]),
    {
      key: '2',
      label: (
        <Text onClick={handleLogout} className='p-2  '>
          Log out
        </Text>
      )
    }
  ]

  const directRoutesObject = {
    logo: directRoutes(userInformation?.role, ROUTE.DASHBOARD, ROUTE.USER_PROFILE),
    [ROUTE.ADMIN_PROFILE]: ROUTE.ADMIN_PROFILE
  }

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
            <Link href={directRoutesObject.logo} onClick={() => setRouteValue(directRoutesObject.logo)}>
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
        <Space className='me-4' size='small'>
          <NotificationPopover />
          <Dropdown menu={{ items }} placement='bottomRight' arrow className='--dropdown-avatar'>
            <div>
              <ImageCustom
                width={40}
                height={40}
                src={userImage}
                preview={false}
                className='--avatar-custom d-cursor'
              />
            </div>
          </Dropdown>
        </Space>
      </Col>
    </>
  )
}

export default MainHeader

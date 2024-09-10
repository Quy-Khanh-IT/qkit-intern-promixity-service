'use client'
import ImageCustom from '@/app/components/ImageCustom/ImageCustom'
import NotificationPopover from '@/app/components/Popover/NotificationPopover'
import { ROUTE, StorageKey } from '@/constants'
import { useAuth } from '@/context/AuthContext'
import '@/sass/common/_common.scss'
import { RoleEnum } from '@/types/enum'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button, Col, Dropdown, Flex, Image, MenuProps, Space, theme, Typography } from 'antd'
import { Header } from 'antd/es/layout/layout'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import '../main.scss'
import { directRoutes } from '../utils/main.util'
import { removeFromSessionStorage } from '@/utils/session-storage.util'
import { useRouter } from 'next/navigation'

const { Text } = Typography

interface IMainHeaderProps {
  collapsed: boolean
  setCollapsed: (_collapsed: boolean) => void
  setRouteValue: (_value: string) => void
  startSelectedMenu: () => void
}

const MainHeader: React.FC<IMainHeaderProps> = ({ collapsed, setCollapsed, setRouteValue, startSelectedMenu }) => {
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const router = useRouter()
  const { onLogout, userInformation } = useAuth()
  const [userRole, setUserRole] = useState<string>('')
  const [userAvatar, setUserAvatar] = useState<string>('')
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  const handleLogout = (): void => {
    removeFromSessionStorage(StorageKey._ROUTE_VALUE)
    onLogout(userRole as RoleEnum)
  }

  useEffect(() => {
    if (userInformation) {
      setUserAvatar(userInformation.image)
      setUserRole(userInformation.role)
      if (userInformation.role === (RoleEnum._ADMIN as string)) {
        setIsAdmin(true)
      }
    }
  }, [userInformation])

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link
          href={userInformation?.role === (RoleEnum._ADMIN as string) ? ROUTE.ADMIN_PROFILE : ROUTE.USER_PROFILE}
          onClick={() => {
            if (isAdmin) {
              setRouteValue(ROUTE.ADMIN_PROFILE)
              router.push(ROUTE.ADMIN_PROFILE)
            } else {
              setRouteValue(ROUTE.USER_PROFILE)
              router.push(ROUTE.USER_PROFILE)
            }
          }}
          className='link-underline-none'
        >
          <Text className='p-2'>Profile</Text>
        </Link>
      )
    },
    {
      key: '2',
      label: (
        <Link href={ROUTE.MAP} onClick={() => setRouteValue(ROUTE.MAP)} className='link-underline-none'>
          <Text className='p-2'>Back to map</Text>
        </Link>
      )
    },
    {
      key: '3',
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
            <Link
              href={directRoutesObject.logo}
              onClick={() => {
                startSelectedMenu()
                setRouteValue(directRoutesObject.logo)
              }}
            >
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
                src={userAvatar}
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

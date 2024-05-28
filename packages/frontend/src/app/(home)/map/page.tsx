'use client'

import Map from './components'
import type { MenuProps } from 'antd'
import { Layout, Image, Input } from 'antd'

import './map.scss'
import { useState } from 'react'

export default function MapPage() {
  const { Header, Content, Sider } = Layout
  const { Search } = Input
  const [collapsed, setCollapsed] = useState(false)

  type MenuItem = Required<MenuProps>['items'][number]

  function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
    return {
      key,
      icon,
      children,
      label
    } as MenuItem
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        className='d-flex justify-content-center align-items-center'
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      ></Sider>
      <Layout>
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div className='demo-logo'>
            <Image src='/logo.png' preview={false} height={40} alt='logo' />
          </div>
          <div className='search-wrapper d-flex justify-content-center align-items-center'>
            <Search placeholder='input search text' enterButton='Search' size='large' loading={false} />
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div className='h-100'>
            <Map />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

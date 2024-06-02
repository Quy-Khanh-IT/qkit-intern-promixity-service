'use client'
import Map from './components'
import { Layout, Image, Input } from 'antd'
import './map.scss'
import { useState } from 'react'
import { useFindNearByQuery } from '@/services/near-by.service'
import { IFindNearByPayLoad, IFindNearByResponse } from '@/types/near-by'

export default function MapPage(): React.ReactNode {
  const { Header, Content, Sider } = Layout
  const { Search } = Input
  const [collapsed, setCollapsed] = useState(true)

  const [searchText, setSearchText] = useState('')

  const data: IFindNearByPayLoad = {
    latitude: 10.78,
    longitude: 106.78,
    radius: 10
  }

  // Use the query hook here
  const { data: response, error, isLoading } = useFindNearByQuery(data)

  const handleOnSearch = (): void => {}

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
            <Search
              allowClear
              className='ml-2'
              placeholder='input search text'
              size='middle'
              enterButton='Search'
              loading={false}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleOnSearch}
            />
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div className='h-100'>
            <Map position={[51.505, -0.09]} />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

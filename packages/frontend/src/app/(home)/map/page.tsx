'use client'
import React, { useEffect, useRef, useState } from 'react'
import Map from './components'
import { Layout, Image, Input } from 'antd'
import './map.scss'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import SearchSider from './components/SearchSider'
import { useFindNearByQuery } from '@/services/near-by.service'
import { IFindNearByPayLoad } from '@/types/near-by'

export default function MapPage(): React.ReactNode {
  const position = useSelector((state: RootState) => state.mapProps.position)
  const zoom = useSelector((state: RootState) => state.mapProps.zoom)
  const { Header, Content } = Layout
  const { Search } = Input
  const [collapsed, setCollapsed] = useState<boolean>(true)
  const [searchText, setSearchText] = useState<string>('')
  const [queryData, setQueryData] = useState<IFindNearByPayLoad>({
    latitude: position[0],
    longitude: position[1],
    radius: 10,
    q: ''
  })

  const {
    data: response,
    isLoading,
    isFetching
  } = useFindNearByQuery(queryData, {
    skip: !queryData
  })

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleOnSearch = (): void => {
    setCollapsed(true)
    const data: IFindNearByPayLoad = {
      latitude: position[0],
      longitude: position[1],
      radius: 10,
      q: searchText
    }
    setQueryData(data) // Trigger the query with new data
    setCollapsed(false)
  }

  const [showSpinner, setShowSpinner] = useState<boolean>(false)

  useEffect(() => {
    console.log('map page render')
    if (isFetching) {
      setShowSpinner(true)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setShowSpinner(false)
      }, 2000)
    } else {
      setShowSpinner(false)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isFetching])

  const handleCloseSider = (): void => {
    setCollapsed(true)
  }

  return (
    <Layout className='vh-100'>
      <Header className='d-flex align-items-center w-100 search-header justify-content-between'>
        <div className='demo-logo'>
          <Image src='/logo_light.png' preview={false} height={40} alt='logo' />
        </div>
        <div className='search-wrapper d-flex justify-content-center align-items-center'>
          <Search
            allowClear
            className='ml-2'
            placeholder='input search text'
            size='middle'
            enterButton='Search'
            loading={isLoading}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleOnSearch}
            width={1000}
          />
        </div>
        {/* user profile */}
        <div>
          <img
            style={{ height: '40px', borderRadius: '50%' }}
            src='https://th.bing.com/th/id/OIP.onRzx6Dli7KhCaT58tGZsgHaHa?rs=1&pid=ImgDetMain'
            alt='avatar'
          />
        </div>
      </Header>

      <Layout>
        <SearchSider
          onClose={handleCloseSider}
          showSpinner={showSpinner}
          businesses={response?.data}
          collapsed={collapsed}
        />
        <Content style={{ margin: '0 16px' }}>
          <div className='h-100'>
            <Map zoom={zoom} position={position} />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

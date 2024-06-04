'use client'
import React, { useEffect, useRef, useState } from 'react'
import Map from './components'
import { Layout, Image, Input, Checkbox, MenuProps, Dropdown, Button, Space } from 'antd'
import './map.scss'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import SearchSider from './components/SearchSider'
import { useFindNearByQuery } from '@/services/near-by.service'
import { IFindNearByPayLoad } from '@/types/near-by'
import { setSearchPosition } from '@/redux/slices/map-props.slice'
import { MAP_LIMIT_BUSINESS, MAP_RADIUS } from '@/constants/map'

export default function MapPage(): React.ReactNode {
  const position = useSelector((state: RootState) => state.mapProps.position)
  const zoom = useSelector((state: RootState) => state.mapProps.zoom)
  const { Header, Content } = Layout
  const { Search } = Input
  const [collapsed, setCollapsed] = useState<boolean>(true)
  const [searchText, setSearchText] = useState<string>('')
  const [isFly, setIsFly] = useState<boolean>(false)
  const dispatch = useDispatch()
  const [distanceRadius, setDistanceRadius] = useState<number>(2)
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)

  const [queryData, setQueryData] = useState<IFindNearByPayLoad>({
    latitude: position[0],
    longitude: position[1],
    radius: 10,
    q: '',
    limit: MAP_LIMIT_BUSINESS.LEVEL_DEFAULT
  })

  const {
    data: response,
    isLoading,
    isFetching
  } = useFindNearByQuery(queryData, {
    skip: !shouldFetch
  })

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleOnSearch = (): void => {
    setIsFly(true)
    setCollapsed(true)

    const limitLevels = {
      [MAP_RADIUS.LEVEL_ONE]: MAP_LIMIT_BUSINESS.LEVEL_ONE,
      [MAP_RADIUS.LEVEL_TWO]: MAP_LIMIT_BUSINESS.LEVEL_TWO,
      [MAP_RADIUS.LEVEL_THREE]: MAP_LIMIT_BUSINESS.LEVEL_THREE,
      [MAP_RADIUS.LEVEL_FOUR]: MAP_LIMIT_BUSINESS.LEVEL_FOUR,
      [MAP_RADIUS.LEVEL_FIVE]: MAP_LIMIT_BUSINESS.LEVEL_FIVE,
      [MAP_RADIUS.LEVEL_SIX]: MAP_LIMIT_BUSINESS.LEVEL_SIX
    }
    const maxLimit: number = distanceRadius
      ? limitLevels[distanceRadius === 0 ? MAP_RADIUS.LEVEL_ONE : distanceRadius * 1000]
      : MAP_LIMIT_BUSINESS.LEVEL_DEFAULT

    const data: IFindNearByPayLoad = {
      latitude: position[0],
      longitude: position[1],
      radius: distanceRadius === 0 ? 0.5 : distanceRadius,
      q: searchText,
      limit: maxLimit
    }
    dispatch(setSearchPosition(position))
    setQueryData(data)
    setCollapsed(false)
    setShouldFetch(true)
  }

  const handleStopFly = (): void => {
    setIsFly(false)
  }

  const [showSpinner, setShowSpinner] = useState<boolean>(false)

  useEffect(() => {
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
  }, [isFetching, zoom])

  const handleCloseSider = (): void => {
    setCollapsed(true)
    dispatch(setSearchPosition(null))
  }

  const items: MenuProps['items'] = [
    {
      label: '500 m',
      key: 0.5
    },
    {
      label: '1 km',
      key: 1
    },
    {
      label: '2 km',
      key: 2
    },
    {
      label: '5 km',
      key: 5
    },
    {
      label: '10 km',
      key: 10
    },
    {
      label: '20 km',
      key: 20
    }
  ]
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setDistanceRadius(parseInt(e.key))
  }
  const menuProps = {
    items,
    onClick: handleMenuClick
  }

  useEffect(() => {
    if (shouldFetch) {
      handleOnSearch()
    }
  }, [distanceRadius])
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
          <Dropdown className='ms-1' menu={menuProps}>
            <Button className='btn-dropdown'>
              <Space>{`Distance: ${distanceRadius === 0 ? `500m` : `${distanceRadius}km`}`}</Space>
            </Button>
          </Dropdown>
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
            <Map
              radius={queryData.radius * 1000}
              businesses={response?.data}
              setStopFly={handleStopFly}
              isFly={isFly}
              zoom={zoom}
              position={position}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

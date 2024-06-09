'use client'
import ImageCustom from '@/app/components/ImageCustom/ImageCustom'
import { ROUTE, StorageKey } from '@/constants'
import { DistanceMenu, LIMIT_BASE_ON_RADIUS, MAP_LIMIT_BUSINESS, MAP_RADIUS } from '@/constants/map'
import { useAuth } from '@/context/AuthContext'
import { useSessionStorage } from '@/hooks/useSessionStorage'
import { setSearchPosition } from '@/redux/slices/map-props.slice'
import { setSelectedBusiness } from '@/redux/slices/selected-business.slice'
import { useFindNearByQuery } from '@/services/near-by.service'
import { IFindNearByPayLoad } from '@/types/near-by'
import { IUserInformation } from '@/types/user'
import { getPresentUrl } from '@/utils/helpers.util'
import { Button, Dropdown, Image, Input, Layout, MenuProps, Space, Typography } from 'antd'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import Map from './components'
import SearchItemDetail from './components/SearchItemDetail'
import SearchSider from './components/SearchSider'
import './map.scss'
import { RoleEnum } from '@/types/enum'

const { Text } = Typography

function MapPage(): React.ReactNode {
  const router = useRouter()
  const { onLogout, userInformation } = useAuth()
  const [userAvatar, setUserAvatar] = useState<string>('')
  const [_routeValue, setRouteValue, _removeRouteValue] = useSessionStorage(
    StorageKey._ROUTE_VALUE,
    getPresentUrl() || ROUTE.MAP
  )

  const position = useSelector((state: RootState) => state.mapProps.position)
  const zoom = useSelector((state: RootState) => state.mapProps.zoom)
  const { selectedBusinessId, selectedBusinessData } = useSelector((state: RootState) => state.selectedBusiness)
  const { Header, Content } = Layout
  const { Search } = Input
  const [collapsed, setCollapsed] = useState<boolean>(true)
  const [searchText, setSearchText] = useState<string>('')
  const [isFly, setIsFly] = useState<boolean>(false)
  const dispatch = useDispatch()
  const [distanceRadius, setDistanceRadius] = useState<number>(MAP_RADIUS.LEVEL_DEFAULT / 1000)
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)
  const [clickPosition, setClickPosition] = useState<[number, number] | null>(null)
  const [rating, setRating] = useState<number>(0)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  const [queryData, setQueryData] = useState<IFindNearByPayLoad>({
    latitude: position[0],
    longitude: position[1],
    radius: MAP_RADIUS.LEVEL_DEFAULT / 1000,
    q: '',
    limit: MAP_LIMIT_BUSINESS.LEVEL_DEFAULT,
    ...(rating !== 0 ? { star: rating } : {}),
    ...(selectedCategoryId !== null && selectedCategoryId !== 'all' ? { categoryId: selectedCategoryId } : {})
  })

  useEffect(() => {
    if (userInformation) {
      setUserAvatar(userInformation.image)
    }
  }, [userInformation])

  const {
    data: searchResponse,
    isLoading,
    isFetching
  } = useFindNearByQuery(queryData, {
    skip: !shouldFetch
  })

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleOnSearch = (): void => {
    setIsFly(true)

    const maxLimit: number = distanceRadius
      ? LIMIT_BASE_ON_RADIUS[distanceRadius === 0 ? MAP_RADIUS.LEVEL_ONE : distanceRadius * 1000]
      : MAP_LIMIT_BUSINESS.LEVEL_DEFAULT

    const data: IFindNearByPayLoad = {
      latitude: clickPosition ? clickPosition[0] : position[0],
      longitude: clickPosition ? clickPosition[1] : position[1],
      radius: distanceRadius === 0 ? 0.5 : distanceRadius,
      q: searchText,
      limit: maxLimit,
      ...(rating !== 0 ? { star: rating } : {}),
      ...(selectedCategoryId !== null && selectedCategoryId !== 'all' ? { categoryId: selectedCategoryId } : {})
    }
    dispatch(setSearchPosition(clickPosition ? clickPosition : position))
    setQueryData(data)
    setCollapsed(false)
    setShouldFetch(true)
    dispatch(setSelectedBusiness({ selectedBusinessId: null, selectedBusinessData: null }))
  }

  const handleStopFly = (): void => {
    setIsFly(false)
  }

  const handleSetClickPosition = (value: [number, number] | null): void => {
    setClickPosition(value)
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
    dispatch(setSelectedBusiness({ selectedBusinessId: null, selectedBusinessData: null }))
  }

  const distanceItems: MenuProps['items'] = DistanceMenu
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setDistanceRadius(parseInt(e.key))
  }
  const distanceMenuProps = {
    items: distanceItems,
    onClick: handleMenuClick
  }

  useEffect(() => {
    if (shouldFetch) {
      handleOnSearch()
    }
  }, [distanceRadius, rating, selectedCategoryId])

  useEffect(() => {
    setCollapsed(true)
    dispatch(setSearchPosition(null))
    dispatch(setSelectedBusiness({ selectedBusinessId: null, selectedBusinessData: null }))
  }, [clickPosition])

  const handleItemClick = (): void => {
    setIsFly(true)
  }

  const handleOnChangeRating = (value: string): void => {
    setRating(parseFloat(value))
  }

  const handleOnChangeCategory = (value: string): void => {
    setSelectedCategoryId(value)
  }

  const handleLogout = (): void => {
    onLogout(userInformation?.role as RoleEnum)
  }

  const avatarMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link href={ROUTE.USER_PROFILE} className='p-2' onClick={() => setRouteValue(ROUTE.USER_PROFILE)}>
          Profile
        </Link>
      )
    },
    {
      key: '2',
      label: <span className='p-2'>My business</span>,
      onClick: (): void => {
        setRouteValue(ROUTE.MY_BUSINESS)
        router.push(ROUTE.MY_BUSINESS)
      }
    },
    {
      key: '3',
      label: <span className='p-2'>Log out</span>,
      onClick: handleLogout
    }
  ]

  return (
    <Layout className='vh-100'>
      <Header className='d-flex align-items-center w-100 search-header justify-content-between'>
        <div className='demo-logo'>
          <Image src='/logo_light.png' preview={false} height={40} alt='logo' />
        </div>
        <div className='search-wrapper d-flex justify-content-center align-items-center'>
          <Search
            autoComplete='on'
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
          <Dropdown className='ms-1' menu={distanceMenuProps}>
            <Button className='btn-dropdown'>
              <Space>
                {`Distance: ${distanceRadius === 0 ? `500m` : `${distanceRadius}km`}`}
                <i className='fa-solid fa-angle-down'></i>
              </Space>
            </Button>
          </Dropdown>
        </div>
        <div style={{ width: 100 }} className='d-flex justify-content-end'>
          {userInformation && userInformation.isVerified ? (
            <>
              <Dropdown menu={{ items: avatarMenuItems }} placement='bottomRight' arrow>
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
            </>
          ) : (
            <>
              <Link href={ROUTE.USER_LOGIN}>
                <Button className='btn-primary'>Sign in</Button>
              </Link>
            </>
          )}
        </div>
      </Header>

      <Layout>
        {selectedBusinessId ? <SearchItemDetail /> : ''}
        <SearchSider
          onClose={handleCloseSider}
          showSpinner={showSpinner}
          businesses={searchResponse?.data}
          collapsed={collapsed}
          totalResult={searchResponse?.totalRecords}
          handleItemClick={handleItemClick}
          handleOnChangeRating={handleOnChangeRating}
          handleOnChangeCategory={handleOnChangeCategory}
          rating={rating}
          categoryId={selectedCategoryId}
        />

        <Content style={{ margin: '0 16px' }}>
          <div className='h-100 w-100'>
            <Map
              radius={queryData.radius * 1000}
              businesses={!collapsed ? searchResponse?.data : []}
              handleSetStopFly={handleStopFly}
              isFly={isFly}
              zoom={zoom}
              position={position}
              clickPosition={clickPosition}
              handleSetClickPosition={handleSetClickPosition}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

const DynamicMapPage = dynamic(() => Promise.resolve(MapPage), { ssr: false })

const MapPageDynamic = (): React.ReactNode => {
  return <DynamicMapPage />
}

export default MapPageDynamic

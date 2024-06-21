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
import { ITimeOption } from '@/types/business'

function MapPage(): React.ReactNode {
  const router = useRouter()
  const { onLogout, userInformation } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [userAvatar, setUserAvatar] = useState<string>('')
  const [_routeValue, setRouteValue, _removeRouteValue] = useSessionStorage(
    StorageKey._ROUTE_VALUE,
    getPresentUrl() || ROUTE.MAP
  )

  const position = useSelector((state: RootState) => state.mapProps.position)
  const zoom = useSelector((state: RootState) => state.mapProps.zoom)
  const { selectedBusinessId } = useSelector((state: RootState) => state.selectedBusiness)
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
  const [createdReview, setCreatedReview] = useState<boolean>(false)

  const [timeOption, setTimeOption] = useState<ITimeOption>({
    timeOpenType: 'every_time',
    day: 'monday',
    openTime: '01:00'
  })
  const [isApplyTimeFilter, setIsApplyTimeFilter] = useState<number>(1)

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  const [queryData, setQueryData] = useState<IFindNearByPayLoad>({
    latitude: position[0],
    longitude: position[1],
    radius: MAP_RADIUS.LEVEL_DEFAULT / 1000,
    q: '',
    limit: MAP_LIMIT_BUSINESS.LEVEL_DEFAULT,
    ...(rating !== 0 ? { star: rating } : {}),
    ...(selectedCategoryId !== null && selectedCategoryId !== 'all' ? { categoryId: selectedCategoryId } : {}),
    ...timeOption
  })

  useEffect(() => {
    if (userInformation) {
      setUserAvatar(userInformation.image)
      if (userInformation.role === (RoleEnum._ADMIN as string)) {
        setIsAdmin(true)
      }
    }
  }, [userInformation])

  const {
    data: searchResponse,
    isLoading,
    isFetching,
    refetch
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
      ...(selectedCategoryId !== null && selectedCategoryId !== 'all' ? { categoryId: selectedCategoryId } : {}),
      ...timeOption
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
      console.log('vao duoc day ne')
      handleOnSearch()
      setCreatedReview(false)
    }
  }, [distanceRadius, rating, selectedCategoryId, isApplyTimeFilter, createdReview])

  const handleChangeFetch = (value: boolean): void => {
    setShouldFetch(value)
    setCreatedReview(value)
  }

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

  const handleOnChangeTimeOption = (type: string, value: string): void => {
    setTimeOption({
      ...timeOption,
      [type]: value
    })
  }

  const handleOnApplyTimeFilter = (): void => {
    setIsApplyTimeFilter(isApplyTimeFilter + 1)
  }

  const handleLogout = (): void => {
    onLogout(userInformation?.role as RoleEnum)
  }

  const avatarMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link
          href={isAdmin ? ROUTE.ADMIN_PROFILE : ROUTE.USER_PROFILE}
          className='p-2'
          onClick={() => {
            if (isAdmin) {
              setRouteValue(ROUTE.ADMIN_PROFILE)
              router.push(ROUTE.ADMIN_PROFILE)
            } else {
              setRouteValue(ROUTE.USER_PROFILE)
              router.push(ROUTE.USER_PROFILE)
            }
          }}
        >
          Profile
        </Link>
      )
    },
    {
      key: '2',
      label: <span className='p-2'>{isAdmin ? 'Dashboard' : 'My business'}</span>,
      onClick: (): void => {
        if (userInformation?.role === (RoleEnum._ADMIN as string)) {
          setRouteValue(ROUTE.DASHBOARD)
          router.push(ROUTE.DASHBOARD)
        } else if (userInformation?.role === (RoleEnum._BUSINESS as string)) {
          setRouteValue(ROUTE.MY_BUSINESS)
          router.push(ROUTE.MY_BUSINESS)
        } else {
          setRouteValue(ROUTE.MY_BUSINESS_CREATE)
          router.push(ROUTE.MY_BUSINESS_CREATE)
        }
      }
    },
    {
      key: '3',
      label: <span className='p-2'>Log out</span>,
      onClick: handleLogout
    }
  ]
  useEffect(() => {
    if (shouldFetch) {
      refetch()
    }
  }, [refetch, shouldFetch, queryData])
  return (
    <Layout className='vh-100'>
      <Header className='d-flex align-items-center w-100 search-header justify-content-between'>
        <div className='demo-logo'>
          <Link href={ROUTE.ROOT}>
            <Image src='/logo_light.png' preview={false} height={40} alt='logo' />
          </Link>
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
        {selectedBusinessId ? <SearchItemDetail handleChangeFetch={handleChangeFetch} /> : ''}
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
          handleOnChangeTimeOption={handleOnChangeTimeOption}
          timeOption={timeOption}
          handleOnApplyTimeFilter={handleOnApplyTimeFilter}
          handleChangeFetch={handleChangeFetch}
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

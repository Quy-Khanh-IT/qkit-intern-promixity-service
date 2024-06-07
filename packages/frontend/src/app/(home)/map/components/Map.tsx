'use client'
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvent,
  useMapEvents
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { IMapProps } from '@/types/map'
import { useEffect, useState } from 'react'
import './map.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setPosition, setZoom } from '@/redux/slices/map-props.slice'
import L, { Icon } from 'leaflet'
import { RootState } from '@/redux/store'
import { MAP_ZOOM, ZOOM_BASE_ON_RADIUS } from '@/constants/map'
import { Image } from 'antd'
import StarRating from './StarRating'
import { IBusiness } from '@/types/business'
import { setSelectedBusiness } from '@/redux/slices/selected-business.slice'
const myIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/ninehcobra/free-host-image/main/Proximity/search-location.png',
  iconSize: [25, 25]
})

const categoryIcon = (url: string): Icon => {
  const myIcon = L.icon({
    iconUrl: url,
    iconSize: [25, 25]
  })
  return myIcon
}

const Map = (props: IMapProps): React.ReactNode => {
  const [center, setCenter] = useState<[number, number]>(props.position)
  const [currentZoom, setCurrentZoom] = useState<number>(props.zoom)
  const searchPosition = useSelector((state: RootState) => state.mapProps.searchPosition)
  const selectedBusinessData = useSelector((state: RootState) => state.selectedBusiness.selectedBusinessData)
  const dispatch = useDispatch()

  const CenterMarker = (): React.ReactNode => {
    const map = useMapEvent('moveend', () => {
      setCenter([map.getCenter().lat, map.getCenter().lng])
    })

    const handleZoomEnd = (): void => {
      const currentZoom = map.getZoom()
      setCurrentZoom(currentZoom)
    }

    useMapEvent('zoomend', handleZoomEnd)

    return null
  }

  const FlyToPosition = (): null => {
    const map = useMap()

    const flyZoom: number = props.radius ? ZOOM_BASE_ON_RADIUS[props.radius] : MAP_ZOOM.LEVEL_DEFAULT
    useEffect(() => {
      if (props.isFly && map && searchPosition) {
        map.flyTo(searchPosition, flyZoom)
        props.handleSetStopFly?.()
      }
      if (props.isFly && selectedBusinessData) {
        const businessCoordinate = selectedBusinessData.location.coordinates
        map.flyTo([businessCoordinate[1], businessCoordinate[0]], 18)
        props.handleSetStopFly?.()
      }
    }, [center, map, selectedBusinessData])
    return null
  }

  useEffect(() => {
    dispatch(setPosition(center))
  }, [center])

  useEffect(() => {
    dispatch(setZoom(currentZoom))
  }, [currentZoom])

  const SearchCircle = (): React.ReactNode => {
    const circleOption = {
      color: '#f27d9d',
      fillOpacity: 0.1,
      weight: 2
    }
    if (searchPosition && props.radius)
      return <Circle center={searchPosition} radius={props.radius} pathOptions={circleOption} />
    else return null
  }

  const HandleClickMap = (): React.ReactNode => {
    let timer: ReturnType<typeof setTimeout> | null = null

    const map = useMapEvents({
      click(e) {
        if (timer) {
          clearTimeout(timer)
          timer = null
        } else {
          timer = setTimeout(() => {
            if (!props.clickPosition) {
              props.handleSetClickPosition?.([e.latlng.lat, e.latlng.lng])
            } else {
              props.handleSetClickPosition?.(null)
            }
            timer = null
          }, 300)
        }
      },
      dblclick() {}
    })

    return null
  }

  const handleClickPopUp = (business: IBusiness): void => {
    dispatch(setSelectedBusiness({ selectedBusinessId: business.id, selectedBusinessData: business }))
  }
  return (
    <MapContainer zoomControl={false} center={center} zoom={props.zoom} className='vh-100 w-100 map-container'>
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {props.zoom < 10 ? (
        ''
      ) : props.clickPosition ? (
        <>
          <Marker icon={myIcon} position={props.clickPosition}>
            <Popup className='mb-3'>Your search position</Popup>
          </Marker>
          <SearchCircle />
        </>
      ) : (
        ''
      )}
      {props.zoom < 10 ? (
        ''
      ) : searchPosition ? (
        <>
          <Marker icon={myIcon} position={searchPosition}>
            <Popup className='mb-3'>Your search position</Popup>
          </Marker>
          <SearchCircle />
        </>
      ) : (
        ''
      )}
      {props.zoom < 10
        ? ''
        : props.businesses && props.businesses.length > 0
          ? props.businesses.map((business) => {
              return (
                <Marker
                  key={business.id}
                  icon={categoryIcon(business.category.linkURL)}
                  position={[business.location.coordinates[1], business.location.coordinates[0]]}
                >
                  <Popup className='mb-3 business-popup'>
                    <div onClick={() => handleClickPopUp(business)}>
                      <Image
                        preview={false}
                        src={business.images?.[0]?.url ? business.images?.[0]?.url : './images/default_business.png'}
                        width={240}
                        height={90}
                        alt='business-image'
                        className='popup-thumb'
                        fallback='./images/default_business.png'
                        style={{ overflow: 'hidden', position: 'relative' }}
                      />
                      <div className='popup-content-wrapper p-2'>
                        <div className='popup-title'>{business.name}</div>
                        <StarRating rating={business.overallRating} totalReview={business.totalReview} />
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
            })
          : ''}
      <CenterMarker />
      <HandleClickMap />
      <FlyToPosition />
      <ZoomControl position='topright' />
    </MapContainer>
  )
}

export default Map

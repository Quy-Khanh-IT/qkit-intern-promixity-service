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
import L from 'leaflet'
import { RootState } from '@/redux/store'
import { MAP_RADIUS, MAP_ZOOM, ZOOM_BASE_ON_RADIUS } from '@/constants/map'

const myIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/ninehcobra/free-host-image/main/Proximity/search-location.png',
  iconSize: [25, 25]
})

const restaurantMarker = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/ninehcobra/free-host-image/main/Proximity/restaurant-marker.png',
  iconSize: [25, 25]
})

const Map = (props: IMapProps): React.ReactNode => {
  const [center, setCenter] = useState<[number, number]>(props.position)
  const [currentZoom, setCurrentZoom] = useState<number>(props.zoom)
  const searchPosition = useSelector((state: RootState) => state.mapProps.searchPosition)
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
    }, [center, map])
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

  useEffect(() => {}, [])
  return (
    <MapContainer zoomControl={false} center={center} zoom={props.zoom} className='vh-100 w-100'>
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
                  icon={restaurantMarker}
                  position={[business.location.coordinates[1], business.location.coordinates[0]]}
                >
                  <Popup className='mb-3'>{business.name}</Popup>
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

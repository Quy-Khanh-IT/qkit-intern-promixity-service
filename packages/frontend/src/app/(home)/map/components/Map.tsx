'use client'
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { IMapProps } from '@/types/map'
import { useEffect, useState } from 'react'
import './map.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setPosition, setZoom } from '@/redux/slices/map-props.slice'
import L from 'leaflet'
import { RootState } from '@/redux/store'
import { MAP_RADIUS, MAP_ZOOM } from '@/constants/map'

const myIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/ninehcobra/free-host-image/main/Proximity/search-location.png',
  iconSize: [25, 25]
})

const restaurantMarker = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/ninehcobra/free-host-image/main/Proximity/restaurant-marker.png',
  iconSize: [25, 25]
})

const Map = ({ position, zoom, businesses, isFly, setStopFly, radius }: IMapProps): React.ReactNode => {
  const [center, setCenter] = useState<[number, number]>(position)
  const [currentZoom, setCurrentZoom] = useState<number>(zoom)
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

    const zoomLevels = {
      [MAP_RADIUS.LEVEL_ONE]: MAP_ZOOM.LEVEL_ONE,
      [MAP_RADIUS.LEVEL_TWO]: MAP_ZOOM.LEVEL_TWO,
      [MAP_RADIUS.LEVEL_THREE]: MAP_ZOOM.LEVEL_THREE,
      [MAP_RADIUS.LEVEL_FOUR]: MAP_ZOOM.LEVEL_FOUR,
      [MAP_RADIUS.LEVEL_FIVE]: MAP_ZOOM.LEVEL_FIVE,
      [MAP_RADIUS.LEVEL_SIX]: MAP_ZOOM.LEVEL_SIX
    }

    const flyZoom: number = radius ? zoomLevels[radius] : MAP_ZOOM.LEVEL_DEFAULT
    useEffect(() => {
      if (isFly && map) {
        map.flyTo(position, flyZoom)
        setStopFly?.()
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
    if (searchPosition && radius) return <Circle center={searchPosition} radius={radius} pathOptions={circleOption} />
    else return null
  }

  return (
    <MapContainer center={center} zoom={zoom} className='vh-100 w-100'>
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {zoom < 10 ? (
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
      {zoom < 10
        ? ''
        : businesses && businesses.length > 0
          ? businesses.map((business) => {
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
      <FlyToPosition />
    </MapContainer>
  )
}

export default Map

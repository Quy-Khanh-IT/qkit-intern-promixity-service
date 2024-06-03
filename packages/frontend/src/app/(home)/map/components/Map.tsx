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

const myIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/ninehcobra/free-host-image/main/Proximity/search-location.png',
  iconSize: [25, 25]
})

const restaurantMarker = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/ninehcobra/free-host-image/main/Proximity/restaurant-marker.png',
  iconSize: [25, 25]
})

const Map = ({ position, zoom, businesses, isFly, setStopFly }: IMapProps): React.ReactNode => {
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
    useEffect(() => {
      if (isFly && map) {
        map.flyTo(position, 14)
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

  return (
    <MapContainer center={center} zoom={zoom} className='vh-100 w-100'>
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {zoom < 13 ? (
        ''
      ) : searchPosition ? (
        <Marker icon={myIcon} position={searchPosition}>
          <Popup className='mb-3'>Your search position</Popup>
        </Marker>
      ) : (
        ''
      )}
      {zoom < 13
        ? ''
        : businesses && businesses.length > 0
          ? businesses.map((business) => {
              return (
                <Marker
                  key={business.id}
                  icon={restaurantMarker}
                  position={[business.location.coordinates[1], business.location.coordinates[0]]}
                >
                  <Popup className='mb-3'>Your search position</Popup>
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

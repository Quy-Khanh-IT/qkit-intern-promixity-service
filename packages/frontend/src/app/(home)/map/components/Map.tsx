'use client'
import { MapContainer, TileLayer, useMapEvent } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { IMapProps } from '@/types/map'
import { useEffect, useState } from 'react'
import './map.scss'
import { useDispatch } from 'react-redux'
import { setPosition } from '@/redux/slices/map-props.slice'

const Map = ({ position, zoom }: IMapProps): React.ReactNode => {
  const [center, setCenter] = useState<[number, number]>(position)
  const dispatch = useDispatch()

  const CenterMarker = (): React.ReactNode => {
    const map = useMapEvent('moveend', () => {
      setCenter([map.getCenter().lat, map.getCenter().lng])
    })

    return null
  }

  useEffect(() => {
    dispatch(setPosition(center))
  }, [center])

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <CenterMarker />
    </MapContainer>
  )
}

export default Map

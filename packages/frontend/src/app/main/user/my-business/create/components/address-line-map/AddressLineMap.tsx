'use client'
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './map.scss'
import { useEffect, useState } from 'react'
import L from 'leaflet'
import { ICreateBusiness } from '@/types/business'

const myIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/ninehcobra/free-host-image/main/Proximity/search-location.png',
  iconSize: [25, 25]
})
const AddressLineMap = ({
  position,
  handleOnChangeData,
  data
}: {
  position: [number, number]
  data: ICreateBusiness
  handleOnChangeData: (
    type: string,
    value: string | number | boolean | string[] | number[] | boolean[] | { coordinates: [number, number] }
  ) => void
}): React.ReactNode => {
  const [center, setCenter] = useState<[number, number]>(position)
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(data.location.coordinates)
  const [isFLy, setIsFly] = useState<boolean>(false)
  useEffect(() => {
    setIsFly(true)
    setCenter(position)
  }, [position])

  const FlyToPosition = (): null => {
    const map = useMap()

    useEffect(() => {
      if (selectedPosition && (selectedPosition[0] !== 0 || selectedPosition[1] !== 0)) {
        map.flyTo(selectedPosition, 17)
      }
      if (map && position && isFLy) {
        map.flyTo(position, 17)
        setIsFly(false)
      }
    }, [center, map])
    return null
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
            setSelectedPosition([e.latlng.lat, e.latlng.lng])

            timer = null
          }, 300)
        }
      },
      dblclick() {}
    })

    return null
  }

  useEffect(() => {
    handleOnChangeData('location', { coordinates: selectedPosition ? selectedPosition : [0, 0] })
  }, [selectedPosition])
  return (
    <MapContainer zoomControl={false} center={center} zoom={19} className='w-100 map-container address-line-map'>
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <ZoomControl position='topright' />
      {selectedPosition ? (
        <Marker icon={myIcon} position={selectedPosition}>
          <Popup className='mb-3'>Your business coordinates</Popup>
        </Marker>
      ) : (
        ''
      )}
      <FlyToPosition />
      <HandleClickMap />
    </MapContainer>
  )
}

export default AddressLineMap

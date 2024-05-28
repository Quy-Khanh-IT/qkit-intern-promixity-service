'use client'
import { MapContainer, TileLayer, Marker, CircleMarker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'

function LocationMarker() {
  const [position, setPosition] = useState<L.LatLngExpression | null>(null)
  const map = useMapEvents({
    click(e: any) {
      ;(e.target as L.Map).locate()
    },
    locationfound(e: L.LocationEvent) {
      setPosition(e.latlng)
      ;(e.target as L.Map).flyTo(e.latlng, map.getZoom())
    }
  })

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  )
}
function Map() {
  return (
    <MapContainer center={[40.609787846393196, 20.7890265133657]} zoom={5}>
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='© <a href="https://www.facebook.com/profile.php?id=100076370654780">QKIT Software</a>'
      />

      <CircleMarker
        className='n w-[150px] h-[150px]'
        center={[40.609787846393196, 20.7890265133657]}
        radius={10}
        color='transparent'
        fillColor='green'
        fillOpacity={0.5}
      >
        <Popup className='w-[460px] h-[150px]'>
          <p className='text-[25px]'>My Location </p>
        </Popup>
      </CircleMarker>
      <LocationMarker />
    </MapContainer>
  )
}

export default Map

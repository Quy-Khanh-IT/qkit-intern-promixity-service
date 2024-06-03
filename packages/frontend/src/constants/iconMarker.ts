import L from 'leaflet'
export const ICON_URLS = {
  CURRENT_POSITION: 'https://raw.githubusercontent.com/ninehcobra/free-host-image/main/Proximity/search-location.png',
  RESTAURANT: 'https://raw.githubusercontent.com/ninehcobra/free-host-image/main/Proximity/restaurant-marker.png'
}

export const ICON_SIZE: [number, number] = [25, 25]

export const restaurantMarker = L.icon({
  iconUrl: ICON_URLS.RESTAURANT,
  iconSize: ICON_SIZE
})

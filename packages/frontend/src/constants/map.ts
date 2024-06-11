export const MAP_RADIUS = {
  LEVEL_ONE: 500,
  LEVEL_TWO: 1000,
  LEVEL_THREE: 2000,
  LEVEL_FOUR: 5000,
  LEVEL_FIVE: 10000,
  LEVEL_SIX: 20000,
  LEVEL_DEFAULT: 2000
}

export const MAP_ZOOM = {
  LEVEL_ONE: 16,
  LEVEL_TWO: 15,
  LEVEL_THREE: 14,
  LEVEL_FOUR: 13,
  LEVEL_FIVE: 12,
  LEVEL_SIX: 11,
  LEVEL_DEFAULT: 14
}

export const MAP_LIMIT_BUSINESS = {
  LEVEL_ONE: 20,
  LEVEL_TWO: 40,
  LEVEL_THREE: 80,
  LEVEL_FOUR: 200,
  LEVEL_FIVE: 400,
  LEVEL_SIX: 800,
  LEVEL_DEFAULT: 80
}

export const ZOOM_BASE_ON_RADIUS = {
  [MAP_RADIUS.LEVEL_ONE]: MAP_ZOOM.LEVEL_ONE,
  [MAP_RADIUS.LEVEL_TWO]: MAP_ZOOM.LEVEL_TWO,
  [MAP_RADIUS.LEVEL_THREE]: MAP_ZOOM.LEVEL_THREE,
  [MAP_RADIUS.LEVEL_FOUR]: MAP_ZOOM.LEVEL_FOUR,
  [MAP_RADIUS.LEVEL_FIVE]: MAP_ZOOM.LEVEL_FIVE,
  [MAP_RADIUS.LEVEL_SIX]: MAP_ZOOM.LEVEL_SIX,
  [MAP_RADIUS.LEVEL_DEFAULT]: MAP_ZOOM.LEVEL_DEFAULT
}

export const LIMIT_BASE_ON_RADIUS = {
  [MAP_RADIUS.LEVEL_ONE]: MAP_LIMIT_BUSINESS.LEVEL_ONE,
  [MAP_RADIUS.LEVEL_TWO]: MAP_LIMIT_BUSINESS.LEVEL_TWO,
  [MAP_RADIUS.LEVEL_THREE]: MAP_LIMIT_BUSINESS.LEVEL_THREE,
  [MAP_RADIUS.LEVEL_FOUR]: MAP_LIMIT_BUSINESS.LEVEL_FOUR,
  [MAP_RADIUS.LEVEL_FIVE]: MAP_LIMIT_BUSINESS.LEVEL_FIVE,
  [MAP_RADIUS.LEVEL_SIX]: MAP_LIMIT_BUSINESS.LEVEL_SIX
}

export const DistanceMenu = [
  {
    label: '500 m',
    key: 0.5
  },
  {
    label: '1 km',
    key: 1
  },
  {
    label: '2 km',
    key: 2
  },
  {
    label: '5 km',
    key: 5
  },
  {
    label: '10 km',
    key: 10
  },
  {
    label: '20 km',
    key: 20
  }
]

export const RatingMenu = [
  {
    label: 'ALL ⭐',
    value: '0'
  },
  {
    label: '0.5 ⭐',
    value: '0.5'
  },
  {
    label: '1.0 ⭐',
    value: '1'
  },
  {
    label: '1.5 ⭐',
    value: '1.5'
  },
  {
    label: '2.0 ⭐',
    value: '2'
  },
  {
    label: '2.5 ⭐',
    value: '2.5'
  },
  {
    label: '3.0 ⭐',
    value: '3'
  },
  {
    label: '3.5 ⭐',
    value: '3.5'
  },
  {
    label: '4.0 ⭐',
    value: '4'
  },
  {
    label: '4.5 ⭐',
    value: '4.5'
  },
  {
    label: '5.0 ⭐',
    value: '5'
  }
]

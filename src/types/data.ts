export type DogAccess = 'allowed' | 'conditional' | 'not-allowed' | 'unknown'
export type TripStatus = 'upcoming' | 'active' | 'past'

export interface Category {
  id: string
  label: string
  icon: string
  color: string
  group: 'urban' | 'nature' | 'water' | 'heritage'
}

export interface PlacePrice {
  label: string
  amount?: number
  currency?: string
}

export interface AdditionalInfo {
  label: string
  value: string
}

export interface TripPlace {
  id: string
  tripId: string
  name: string
  locality: string
  categoryId: string
  latitude: number
  longitude: number
  imageUrl: string
  imageSourceUrl: string
  imageAttribution: string
  alt: string
  description: string
  tips: string[]
  price: PlacePrice | null
  dogAccess: DogAccess
  dogNotes: string
  officialSourceUrl: string
  googleMapsUrl: string
  additionalInfo: AdditionalInfo[]
}

export interface TripSummary {
  id: string
  file: string
  name: string
  periodLabel: string
  startDate: string | null
  endDate: string | null
  status: TripStatus
}

export interface TripData {
  id: string
  places: TripPlace[]
}

export interface PlaceUserState {
  favorite: boolean
  visited: boolean
  deleted: boolean
  updatedAt: string
}

export type PlaceStateMap = Record<string, PlaceUserState>

export interface Coordinate {
  latitude: number
  longitude: number
}

export interface MapBoundsValue {
  north: number
  south: number
  east: number
  west: number
}

export interface RouteResult {
  coordinates: [number, number][]
  distanceKm: number
  durationMinutes: number
  legs: Array<{
    distanceKm: number
    durationMinutes: number
  }>
  bounds: MapBoundsValue
  approximate: boolean
}

export type RouteStatus = 'idle' | 'loading' | 'success' | 'error'

import type { MapBoundsValue, PlaceStateMap, TripPlace } from '../../types/data'

export interface PlaceFilters {
  query: string
  categoryIds: string[]
  favoritesOnly: boolean
}

export const EMPTY_FILTERS: PlaceFilters = {
  query: '',
  categoryIds: [],
  favoritesOnly: false,
}

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es')
}

export function filterPlaces(
  places: TripPlace[],
  filters: PlaceFilters,
  states: PlaceStateMap,
) {
  const query = normalize(filters.query.trim())
  return places.filter((place) => {
    const state = states[place.id]
    if (state?.deleted) return false
    if (filters.favoritesOnly && !state?.favorite) return false
    if (filters.categoryIds.length > 0 && !filters.categoryIds.includes(place.categoryId)) return false
    if (!query) return true
    return normalize(`${place.name} ${place.locality} ${place.description}`).includes(query)
  })
}

export function placeIsInBounds(place: TripPlace, bounds: MapBoundsValue | null) {
  if (!bounds) return true
  return (
    place.latitude <= bounds.north &&
    place.latitude >= bounds.south &&
    place.longitude <= bounds.east &&
    place.longitude >= bounds.west
  )
}

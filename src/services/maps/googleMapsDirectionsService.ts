import type { Coordinate, TripPlace } from '../../types/data'

function coordinateValue(coordinate: Coordinate) {
  return `${coordinate.latitude},${coordinate.longitude}`
}

export function createGoogleMapsDirectionsUrl(origin: Coordinate, orderedStops: TripPlace[]) {
  const destination = orderedStops.at(-1)
  if (!destination) return ''

  const url = new URL('https://www.google.com/maps/dir/')
  url.searchParams.set('api', '1')
  url.searchParams.set('origin', coordinateValue(origin))
  url.searchParams.set('destination', coordinateValue(destination))
  url.searchParams.set('travelmode', 'driving')

  const waypoints = orderedStops.slice(0, -1).map(coordinateValue)
  if (waypoints.length > 0) url.searchParams.set('waypoints', waypoints.join('|'))

  return url.toString()
}

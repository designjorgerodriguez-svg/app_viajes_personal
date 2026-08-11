import type { Coordinate, RouteResult } from '../../types/data'

const EARTH_RADIUS_KM = 6371
const ORIENTATIVE_SPEED_KMH = 50

function toRadians(value: number) {
  return value * Math.PI / 180
}

export function calculateRouteEstimate(origin: Coordinate, destination: Coordinate): RouteResult {
  const latitudeDelta = toRadians(destination.latitude - origin.latitude)
  const longitudeDelta = toRadians(destination.longitude - origin.longitude)
  const originLatitude = toRadians(origin.latitude)
  const destinationLatitude = toRadians(destination.latitude)
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(originLatitude) * Math.cos(destinationLatitude) * Math.sin(longitudeDelta / 2) ** 2
  const distanceKm = 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(Math.min(1, haversine)))

  return {
    coordinates: [
      [origin.longitude, origin.latitude],
      [destination.longitude, destination.latitude],
    ],
    distanceKm,
    durationMinutes: Math.max(1, Math.round(distanceKm / ORIENTATIVE_SPEED_KMH * 60)),
    bounds: {
      north: Math.max(origin.latitude, destination.latitude),
      south: Math.min(origin.latitude, destination.latitude),
      east: Math.max(origin.longitude, destination.longitude),
      west: Math.min(origin.longitude, destination.longitude),
    },
    approximate: true,
  }
}

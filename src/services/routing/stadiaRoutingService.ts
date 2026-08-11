import polyline from '@mapbox/polyline'
import type { Coordinate, RouteResult } from '../../types/data'

interface StadiaRouteResponse {
  trip: {
    status: number
    status_message?: string
    legs: Array<{ shape: string }>
    summary: {
      time: number
      length: number
      min_lat: number
      max_lat: number
      min_lon: number
      max_lon: number
    }
  }
}

export async function calculateDrivingRoute(
  origin: Coordinate,
  destination: Coordinate,
): Promise<RouteResult> {
  const request = await fetch('https://api.stadiamaps.com/route/v1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      locations: [
        { lat: origin.latitude, lon: origin.longitude, type: 'break' },
        { lat: destination.latitude, lon: destination.longitude, type: 'break' },
      ],
      costing: 'auto',
      units: 'km',
      language: 'es-ES',
    }),
  })

  if (!request.ok) {
    throw new Error(`El servicio de rutas ha respondido con ${request.status}.`)
  }

  const response = (await request.json()) as StadiaRouteResponse
  if (!response.trip || response.trip.status !== 0) {
    throw new Error('No se ha podido calcular una ruta para esos puntos.')
  }

  const coordinates = response.trip.legs.flatMap((leg, legIndex) => {
    const legCoordinates = polyline
      .decode(leg.shape, 6)
      .map(([latitude, longitude]) => [longitude, latitude] as [number, number])

    return legIndex === 0 ? legCoordinates : legCoordinates.slice(1)
  })

  const summary = response.trip.summary
  return {
    coordinates,
    distanceKm: summary.length,
    durationMinutes: Math.max(1, Math.round(summary.time / 60)),
    bounds: {
      north: summary.max_lat,
      south: summary.min_lat,
      east: summary.max_lon,
      west: summary.min_lon,
    },
  }
}

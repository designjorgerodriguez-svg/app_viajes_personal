import polyline from '@mapbox/polyline'
import type { Coordinate, RouteResult } from '../../types/data'

interface StadiaRouteResponse {
  trip: {
    status: number
    status_message?: string
    legs: Array<{
      shape: string
      summary: {
        time: number
        length: number
      }
    }>
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

export interface OptimizedDrivingRouteResult {
  route: RouteResult
  orderedDestinationIndexes: number[]
}

async function requestDrivingRoute(
  locations: Coordinate[],
  signal?: AbortSignal,
) {
  let request: Response
  try {
    request = await fetch('https://api.stadiamaps.com/route/v1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({
        locations: locations.map((location) => ({
          lat: location.latitude,
          lon: location.longitude,
          type: 'break',
        })),
        costing: 'auto',
        units: 'km',
        language: 'es-ES',
      }),
    })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new Error('No se ha podido conectar con el servicio de rutas.')
  }

  if (!request.ok) {
    if (request.status === 401 || request.status === 403) {
      throw new Error('Stadia Maps no ha autorizado las rutas en este dominio.')
    }
    throw new Error(`El servicio de rutas ha respondido con ${request.status}.`)
  }

  const response = (await request.json()) as StadiaRouteResponse
  if (!response.trip || response.trip.status !== 0) {
    throw new Error('No se ha podido calcular una ruta para esos puntos.')
  }

  return response
}

function toRouteResult(response: StadiaRouteResponse): RouteResult {
  const coordinates = response.trip.legs.flatMap((leg, legIndex) => {
    const legCoordinates = polyline
      .decode(leg.shape, 6)
      .map(([latitude, longitude]) => [longitude, latitude] as [number, number])

    return legIndex === 0 ? legCoordinates : legCoordinates.slice(1)
  })

  if (coordinates.length < 2) {
    throw new Error('El servicio de rutas no ha devuelto un recorrido válido.')
  }

  const summary = response.trip.summary
  return {
    coordinates,
    distanceKm: summary.length,
    durationMinutes: Math.max(1, Math.round(summary.time / 60)),
    legs: response.trip.legs.map((leg) => ({
      distanceKm: leg.summary.length,
      durationMinutes: Math.max(1, Math.round(leg.summary.time / 60)),
    })),
    bounds: {
      north: summary.max_lat,
      south: summary.min_lat,
      east: summary.max_lon,
      west: summary.min_lon,
    },
    approximate: false,
  }
}

export async function calculateDrivingRoute(
  origin: Coordinate,
  destination: Coordinate,
  signal?: AbortSignal,
): Promise<RouteResult> {
  const response = await requestDrivingRoute([origin, destination], signal)
  return toRouteResult(response)
}

function coordinateDistanceSquared(from: Coordinate, to: Coordinate) {
  const latitudeScale = Math.cos(((from.latitude + to.latitude) / 2) * Math.PI / 180)
  const latitude = from.latitude - to.latitude
  const longitude = (from.longitude - to.longitude) * latitudeScale
  return latitude * latitude + longitude * longitude
}

function permutations(values: number[]): number[][] {
  if (values.length <= 1) return [values]
  return values.flatMap((value, index) => (
    permutations(values.filter((_, valueIndex) => valueIndex !== index))
      .map((remainder) => [value, ...remainder])
  ))
}

async function calculateExactRoadOrder(
  origin: Coordinate,
  destinations: Coordinate[],
  signal?: AbortSignal,
) {
  const candidateOrders = permutations(
    destinations.map((_, index) => index),
  )

  const candidates: Array<{
    order: number[]
    response: StadiaRouteResponse
    durationSeconds: number
  }> = []
  const batchSize = 4

  for (let index = 0; index < candidateOrders.length; index += batchSize) {
    const batch = await Promise.all(
      candidateOrders.slice(index, index + batchSize).map(async (order) => {
        try {
          const response = await requestDrivingRoute(
            [origin, ...order.map((destinationIndex) => destinations[destinationIndex])],
            signal,
          )
          return { order, response, durationSeconds: response.trip.summary.time }
        } catch (error) {
          if (signal?.aborted) throw error
          return null
        }
      }),
    )
    candidates.push(...batch.filter((candidate) => candidate !== null))
  }

  return candidates
    .sort((first, second) => first.durationSeconds - second.durationSeconds)[0] ?? null
}

async function calculateRoadAwareOrder(
  origin: Coordinate,
  destinations: Coordinate[],
  signal?: AbortSignal,
) {
  const remainingIndexes = destinations.map((_, index) => index)
  const orderedIndexes: number[] = []
  let currentLocation = origin

  while (remainingIndexes.length > 1) {
    const candidates = await Promise.all(
      remainingIndexes.map(async (destinationIndex) => {
        try {
          const response = await requestDrivingRoute(
            [currentLocation, destinations[destinationIndex]],
            signal,
          )
          return {
            destinationIndex,
            durationSeconds: response.trip.summary.time,
          }
        } catch (error) {
          if (signal?.aborted) throw error
          return { destinationIndex, durationSeconds: Number.POSITIVE_INFINITY }
        }
      }),
    )

    candidates.sort((first, second) => {
      if (first.durationSeconds !== second.durationSeconds) {
        return first.durationSeconds - second.durationSeconds
      }
      return coordinateDistanceSquared(
        currentLocation,
        destinations[first.destinationIndex],
      ) - coordinateDistanceSquared(
        currentLocation,
        destinations[second.destinationIndex],
      )
    })

    const nextIndex = Number.isFinite(candidates[0].durationSeconds)
      ? candidates[0].destinationIndex
      : remainingIndexes.reduce((closestIndex, destinationIndex) => (
          coordinateDistanceSquared(currentLocation, destinations[destinationIndex])
            < coordinateDistanceSquared(currentLocation, destinations[closestIndex])
            ? destinationIndex
            : closestIndex
        ))

    orderedIndexes.push(nextIndex)
    currentLocation = destinations[nextIndex]
    remainingIndexes.splice(remainingIndexes.indexOf(nextIndex), 1)
  }

  orderedIndexes.push(...remainingIndexes)
  return orderedIndexes
}

export async function calculateOptimizedDrivingRoute(
  origin: Coordinate,
  destinations: Coordinate[],
  signal?: AbortSignal,
): Promise<OptimizedDrivingRouteResult> {
  if (destinations.length === 0) {
    throw new Error('Añade al menos un destino para calcular la ruta.')
  }

  if (destinations.length >= 2 && destinations.length <= 4) {
    const exactRoute = await calculateExactRoadOrder(origin, destinations, signal)
    if (exactRoute) {
      return {
        route: toRouteResult(exactRoute.response),
        orderedDestinationIndexes: exactRoute.order,
      }
    }
  }

  const orderedDestinationIndexes = destinations.length >= 2
    ? await calculateRoadAwareOrder(origin, destinations, signal)
    : destinations.map((_, index) => index)
  const orderedDestinations = orderedDestinationIndexes.map((index) => destinations[index])
  const response = await requestDrivingRoute([origin, ...orderedDestinations], signal)

  return {
    route: toRouteResult(response),
    orderedDestinationIndexes,
  }
}

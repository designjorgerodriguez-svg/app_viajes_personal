interface GeocodingResult {
  id: number
  latitude: number
  longitude: number
}

interface GeocodingResponse {
  results?: GeocodingResult[]
}

const locationUrlCache = new Map<string, string>()
const localityAliases: Record<string, string> = {
  orbaizeta: 'Orbaiceta',
}

function getPrimaryLocality(locality: string) {
  return locality.split('/')[0].split(',')[0].trim()
}

function getLocalitySearchNames(locality: string) {
  const normalizedLocality = locality.replace(/[\u2018\u2019]/g, "'")
  const alias = localityAliases[normalizedLocality.toLowerCase()]
  return [...new Set([normalizedLocality, alias].filter((value): value is string => Boolean(value)))]
}

function distanceSquared(
  latitude: number,
  longitude: number,
  result: GeocodingResult,
) {
  const latitudeDelta = result.latitude - latitude
  const longitudeDelta = (result.longitude - longitude) * Math.cos(latitude * Math.PI / 180)
  return latitudeDelta ** 2 + longitudeDelta ** 2
}

function slugifyLocality(locality: string) {
  return locality
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'lugar'
}

export async function getMeteoblueLocationUrl(
  locality: string,
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
) {
  const primaryLocality = getPrimaryLocality(locality)
  const cacheKey = `${primaryLocality.toLowerCase()}|${latitude.toFixed(3)},${longitude.toFixed(3)}`
  const cachedUrl = locationUrlCache.get(cacheKey)
  if (cachedUrl) return cachedUrl

  let locations: GeocodingResult[] = []
  for (const searchName of getLocalitySearchNames(primaryLocality)) {
    const parameters = new URLSearchParams({
      name: searchName,
      count: '10',
      language: 'es',
      format: 'json',
    })
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${parameters}`, { signal })
    const payload = await response.json() as GeocodingResponse
    if (response.ok && payload.results?.length) {
      locations = payload.results
      break
    }
  }

  const nearestLocation = locations
    .filter((result) => Number.isFinite(result.id)
      && Number.isFinite(result.latitude)
      && Number.isFinite(result.longitude))
    .sort((left, right) => (
      distanceSquared(latitude, longitude, left) - distanceSquared(latitude, longitude, right)
    ))[0]
  if (!nearestLocation) throw new Error('No se pudo localizar el lugar en Meteoblue.')

  const locationUrl = `https://www.meteoblue.com/es/tiempo/semana/${slugifyLocality(primaryLocality)}_lugar_${nearestLocation.id}`
  locationUrlCache.set(cacheKey, locationUrl)
  return locationUrl
}

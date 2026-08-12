export interface DailyWeatherForecast {
  date: string
  weatherCode: number
  maximumTemperature: number
  minimumTemperature: number
  precipitationProbability: number | null
}

interface OpenMeteoDailyResponse {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  precipitation_probability_max: Array<number | null>
}

interface OpenMeteoForecastResponse {
  daily?: OpenMeteoDailyResponse
  error?: boolean
  reason?: string
}

interface CachedForecast {
  expiresAt: number
  days: DailyWeatherForecast[]
}

const FORECAST_DAYS = 7
const CACHE_DURATION_MS = 30 * 60 * 1000
const forecastCache = new Map<string, CachedForecast>()

function coordinateCacheKey(latitude: number, longitude: number) {
  return `${latitude.toFixed(4)},${longitude.toFixed(4)}`
}

function hasForecastDays(daily: OpenMeteoDailyResponse) {
  return [
    daily.time,
    daily.weather_code,
    daily.temperature_2m_max,
    daily.temperature_2m_min,
    daily.precipitation_probability_max,
  ].every((values) => Array.isArray(values) && values.length >= FORECAST_DAYS)
}

export async function getSevenDayWeatherForecast(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
) {
  const cacheKey = coordinateCacheKey(latitude, longitude)
  const cachedForecast = forecastCache.get(cacheKey)
  if (cachedForecast && cachedForecast.expiresAt > Date.now()) return cachedForecast.days

  const parameters = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: String(FORECAST_DAYS),
  })
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${parameters}`, { signal })
  const payload = await response.json() as OpenMeteoForecastResponse

  if (!response.ok || payload.error) {
    throw new Error(payload.reason || 'No se pudo consultar la previsión meteorológica.')
  }
  if (!payload.daily || !hasForecastDays(payload.daily)) {
    throw new Error('La previsión meteorológica recibida está incompleta.')
  }

  const days = payload.daily.time.slice(0, FORECAST_DAYS).map((date, index) => ({
    date,
    weatherCode: payload.daily!.weather_code[index],
    maximumTemperature: Math.round(payload.daily!.temperature_2m_max[index]),
    minimumTemperature: Math.round(payload.daily!.temperature_2m_min[index]),
    precipitationProbability: payload.daily!.precipitation_probability_max[index] === null
      ? null
      : Math.round(payload.daily!.precipitation_probability_max[index]),
  }))

  forecastCache.set(cacheKey, { expiresAt: Date.now() + CACHE_DURATION_MS, days })
  return days
}

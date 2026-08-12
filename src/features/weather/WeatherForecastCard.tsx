import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudOff,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  RefreshCw,
  Sun,
  type LucideIcon,
} from 'lucide-react'
import { useMeteoblueLocationUrl } from '../../hooks/useMeteoblueLocationUrl'
import { useWeatherForecast } from '../../hooks/useWeatherForecast'

interface WeatherForecastCardProps {
  latitude: number
  locality: string
  longitude: number
  placeName: string
}

interface WeatherCondition {
  icon: LucideIcon
  label: string
}

const weekdayFormatter = new Intl.DateTimeFormat('es-ES', { weekday: 'short' })

function getWeatherCondition(code: number): WeatherCondition {
  if (code === 0) return { icon: Sun, label: 'Despejado' }
  if (code === 1 || code === 2) return { icon: CloudSun, label: 'Parcialmente nuboso' }
  if (code === 3) return { icon: Cloud, label: 'Cubierto' }
  if (code === 45 || code === 48) return { icon: CloudFog, label: 'Niebla' }
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: CloudSnow, label: 'Nieve' }
  if ([95, 96, 99].includes(code)) return { icon: CloudLightning, label: 'Tormenta' }
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { icon: CloudRain, label: 'Lluvia' }
  }
  return { icon: CloudSun, label: 'Tiempo variable' }
}

function formatWeekday(date: string, index: number) {
  if (index === 0) return 'Hoy'
  const weekday = weekdayFormatter.format(new Date(`${date}T12:00:00`)).replace('.', '')
  return weekday.charAt(0).toUpperCase() + weekday.slice(1)
}

export function WeatherForecastCard({ latitude, locality, longitude, placeName }: WeatherForecastCardProps) {
  const { days, error, loading, retry } = useWeatherForecast(latitude, longitude)
  const meteoblueLocationUrl = useMeteoblueLocationUrl(locality, latitude, longitude)

  return (
    <section className="weather-card" aria-label={`Previsión del tiempo para ${placeName}`}>
      <header className="weather-card__header">
        <strong>Próximos 7 días</strong>
      </header>

      {loading ? (
        <div className="weather-card__days weather-card__days--loading" aria-label="Cargando previsión">
          {Array.from({ length: 7 }, (_, index) => <span key={index} />)}
        </div>
      ) : null}

      {!loading && error ? (
        <div className="weather-card__error" role="status">
          <CloudOff size={20} aria-hidden="true" />
          <span>Tiempo no disponible</span>
          <button onClick={retry} type="button" aria-label="Volver a cargar el tiempo">
            <RefreshCw size={15} aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="weather-card__days">
          {days.map((day, index) => {
            const condition = getWeatherCondition(day.weatherCode)
            const WeatherIcon = condition.icon
            const dayLabel = formatWeekday(day.date, index)
            const precipitationLabel = day.precipitationProbability === null
              ? 'probabilidad de precipitación no disponible'
              : `${day.precipitationProbability} por ciento de precipitación`
            return (
              <a
                className="weather-day"
                href={meteoblueLocationUrl || undefined}
                key={day.date}
                aria-label={`${dayLabel}: ${condition.label}, máxima ${day.maximumTemperature} grados, mínima ${day.minimumTemperature} grados y ${precipitationLabel}.${meteoblueLocationUrl ? ' Abrir directamente en Meteoblue' : ''}`}
                title={meteoblueLocationUrl ? `Ver la previsión para ${locality} en Meteoblue` : undefined}
              >
                <time dateTime={day.date}>{dayLabel}</time>
                <WeatherIcon size={21} strokeWidth={1.9} aria-hidden="true" />
                <span className="weather-day__maximum">{day.maximumTemperature}°</span>
                <span className="weather-day__minimum">{day.minimumTemperature}°</span>
                <span className="weather-day__precipitation">
                  <Droplets size={10} aria-hidden="true" />
                  {day.precipitationProbability === null ? '—' : `${day.precipitationProbability}%`}
                </span>
              </a>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}

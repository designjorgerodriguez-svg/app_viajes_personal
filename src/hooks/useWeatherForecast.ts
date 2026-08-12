import { useCallback, useEffect, useState } from 'react'
import {
  getSevenDayWeatherForecast,
  type DailyWeatherForecast,
} from '../services/weather/openMeteoWeatherService'

interface WeatherForecastState {
  days: DailyWeatherForecast[]
  error: string
  loading: boolean
}

const initialState: WeatherForecastState = {
  days: [],
  error: '',
  loading: true,
}

export function useWeatherForecast(latitude: number, longitude: number) {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<WeatherForecastState>(initialState)

  useEffect(() => {
    const controller = new AbortController()
    setState(initialState)

    void getSevenDayWeatherForecast(latitude, longitude, controller.signal)
      .then((days) => setState({ days, error: '', loading: false }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({
          days: [],
          error: error instanceof Error ? error.message : 'No se pudo cargar el tiempo.',
          loading: false,
        })
      })

    return () => controller.abort()
  }, [attempt, latitude, longitude])

  const retry = useCallback(() => setAttempt((currentAttempt) => currentAttempt + 1), [])

  return { ...state, retry }
}

import { useCallback, useState } from 'react'
import type { Coordinate } from '../types/data'

export type GeolocationStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'denied'
  | 'unavailable'
  | 'timeout'
  | 'error'

export function useGeolocation() {
  const [status, setStatus] = useState<GeolocationStatus>('idle')
  const [coordinate, setCoordinate] = useState<Coordinate | null>(null)

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('unavailable')
      return
    }

    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoordinate({ latitude: coords.latitude, longitude: coords.longitude })
        setStatus('success')
      },
      (error) => {
        const errorStatus: GeolocationStatus =
          error.code === error.PERMISSION_DENIED
            ? 'denied'
            : error.code === error.POSITION_UNAVAILABLE
              ? 'unavailable'
              : error.code === error.TIMEOUT
                ? 'timeout'
                : 'error'
        setStatus(errorStatus)
      },
      { enableHighAccuracy: true, maximumAge: 30_000, timeout: 12_000 },
    )
  }, [])

  return { coordinate, status, requestLocation }
}

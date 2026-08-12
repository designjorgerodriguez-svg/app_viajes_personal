import { useEffect, useState } from 'react'
import { getMeteoblueLocationUrl } from '../services/weather/meteoblueLocationService'

export function useMeteoblueLocationUrl(
  locality: string,
  latitude: number,
  longitude: number,
) {
  const [url, setUrl] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    setUrl('')

    void getMeteoblueLocationUrl(locality, latitude, longitude, controller.signal)
      .then(setUrl)
      .catch(() => {
        if (!controller.signal.aborted) setUrl('')
      })

    return () => controller.abort()
  }, [latitude, locality, longitude])

  return url
}

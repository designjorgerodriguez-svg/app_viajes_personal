import { useCallback, useEffect, useState } from 'react'
import {
  EMPTY_PLACE_STATE,
  loadPlaceStates,
  savePlaceStates,
} from '../services/persistence/localPlaceStateRepository'
import type { PlaceStateMap, PlaceUserState } from '../types/data'

export function usePlaceStates() {
  const [states, setStates] = useState<PlaceStateMap>(loadPlaceStates)

  useEffect(() => savePlaceStates(states), [states])

  const getState = useCallback(
    (placeId: string): PlaceUserState => states[placeId] ?? EMPTY_PLACE_STATE,
    [states],
  )

  const updateState = useCallback(
    (placeId: string, update: Partial<Pick<PlaceUserState, 'favorite' | 'visited' | 'deleted'>>) => {
      setStates((current) => ({
        ...current,
        [placeId]: {
          ...(current[placeId] ?? EMPTY_PLACE_STATE),
          ...update,
          updatedAt: new Date().toISOString(),
        },
      }))
    },
    [],
  )

  const toggleFavorite = useCallback(
    (placeId: string) => updateState(placeId, { favorite: !getState(placeId).favorite }),
    [getState, updateState],
  )

  const toggleVisited = useCallback(
    (placeId: string) => updateState(placeId, { visited: !getState(placeId).visited }),
    [getState, updateState],
  )

  const softDelete = useCallback(
    (placeId: string) => updateState(placeId, { deleted: true }),
    [updateState],
  )

  return { states, getState, toggleFavorite, toggleVisited, softDelete }
}

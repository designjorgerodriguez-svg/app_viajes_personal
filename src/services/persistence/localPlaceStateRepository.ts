import type { PlaceStateMap, PlaceUserState } from '../../types/data'

const STORAGE_KEY = 'brujula:place-states:v1'

export const EMPTY_PLACE_STATE: PlaceUserState = {
  favorite: false,
  visited: false,
  deleted: false,
  updatedAt: '',
}

export function loadPlaceStates(): PlaceStateMap {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value ? (JSON.parse(value) as PlaceStateMap) : {}
  } catch {
    return {}
  }
}

export function savePlaceStates(states: PlaceStateMap) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(states))
  } catch {
    // La aplicación sigue funcionando si el navegador bloquea el almacenamiento.
  }
}

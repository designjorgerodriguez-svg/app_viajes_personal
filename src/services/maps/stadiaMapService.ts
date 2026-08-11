export type MapStyleId = 'outdoors' | 'satellite'

export const STADIA_STYLE_URLS: Record<MapStyleId, string> = {
  outdoors: 'https://tiles.stadiamaps.com/styles/outdoors.json',
  satellite: 'https://tiles.stadiamaps.com/styles/alidade_satellite.json',
}

export function getStadiaStyleUrl(styleId: MapStyleId) {
  return STADIA_STYLE_URLS[styleId]
}

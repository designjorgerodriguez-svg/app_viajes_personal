import type { StyleSpecification } from 'maplibre-gl'

export type MapStyleId = 'outdoors' | 'satellite'

const STADIA_RASTER_TILEJSON_URLS: Record<MapStyleId, string> = {
  outdoors: 'https://tiles.stadiamaps.com/styles/outdoors/rendered.json',
  satellite: 'https://tiles.stadiamaps.com/styles/alidade_satellite/rendered.json',
}

export function getStadiaStyle(styleId: MapStyleId): StyleSpecification {
  return {
    version: 8,
    glyphs: 'https://tiles.stadiamaps.com/fonts/{fontstack}/{range}.pbf',
    sources: {
      'stadia-base': {
        type: 'raster',
        url: STADIA_RASTER_TILEJSON_URLS[styleId],
        tileSize: 256,
      },
    },
    layers: [
      { id: 'map-background', type: 'background', paint: { 'background-color': '#f9f3ea' } },
      { id: 'stadia-base', type: 'raster', source: 'stadia-base' },
    ],
  }
}

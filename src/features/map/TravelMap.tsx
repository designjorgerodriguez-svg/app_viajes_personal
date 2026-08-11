import * as maplibregl from 'maplibre-gl'
import type {
  GeoJSONSource,
  Map as MapLibreMap,
} from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useRef } from 'react'
import { categoryById } from '../../data'
import { getStadiaStyle, type MapStyleId } from '../../services/maps/stadiaMapService'
import type { Coordinate, MapBoundsValue, RouteResult, TripPlace } from '../../types/data'

interface TravelMapProps {
  active: boolean
  places: TripPlace[]
  route: RouteResult | null
  selectedPlaceId: string | null
  styleId: MapStyleId
  userLocation: Coordinate | null
  onBoundsChange: (bounds: MapBoundsValue) => void
  onMapError: (message: string) => void
  onSelectPlace: (placeId: string) => void
}

type MapPropsSnapshot = Pick<
  TravelMapProps,
  'places' | 'route' | 'selectedPlaceId' | 'userLocation' | 'onBoundsChange' | 'onSelectPlace'
>

const EMPTY_COLLECTION: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] }

function routeToGeoJson(route: RouteResult | null): GeoJSON.FeatureCollection {
  if (!route) return EMPTY_COLLECTION
  return {
    type: 'FeatureCollection',
    features: [{ type: 'Feature', geometry: { type: 'LineString', coordinates: route.coordinates }, properties: {} }],
  }
}

function userLocationToGeoJson(location: Coordinate | null): GeoJSON.FeatureCollection {
  if (!location) return EMPTY_COLLECTION
  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [location.longitude, location.latitude] },
      properties: {},
    }],
  }
}

function addAppSourcesAndLayers(map: MapLibreMap, snapshot: MapPropsSnapshot) {
  map.addSource('route', { type: 'geojson', data: routeToGeoJson(snapshot.route) })
  map.addLayer({
    id: 'route-outline',
    type: 'line',
    source: 'route',
    paint: { 'line-color': '#ffffff', 'line-width': 9, 'line-opacity': 0.9 },
    layout: { 'line-cap': 'round', 'line-join': 'round' },
  })
  map.addLayer({
    id: 'route-line',
    type: 'line',
    source: 'route',
    paint: { 'line-color': '#0BAA77', 'line-width': 5 },
    layout: { 'line-cap': 'round', 'line-join': 'round' },
  })

  map.addSource('user-location', { type: 'geojson', data: userLocationToGeoJson(snapshot.userLocation) })
  map.addLayer({
    id: 'user-location-halo',
    type: 'circle',
    source: 'user-location',
    paint: { 'circle-color': '#168CA0', 'circle-radius': 18, 'circle-opacity': 0.2 },
  })
  map.addLayer({
    id: 'user-location-dot',
    type: 'circle',
    source: 'user-location',
    paint: {
      'circle-color': '#168CA0',
      'circle-radius': 7,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 3,
    },
  })
}

function setSourceData(map: MapLibreMap, sourceId: string, data: GeoJSON.FeatureCollection) {
  const source = map.getSource(sourceId) as GeoJSONSource | undefined
  source?.setData(data)
}

interface PlaceMarkerValue {
  element: HTMLButtonElement
  marker: maplibregl.Marker
}

function syncPlaceMarkers(
  map: MapLibreMap,
  markerMap: Map<string, PlaceMarkerValue>,
  places: TripPlace[],
  selectedPlaceId: string | null,
  onSelectPlace: (placeId: string) => void,
) {
  const activeIds = new Set(places.map((place) => place.id))
  const localityGroups = new Map<string, TripPlace[]>()
  places.forEach((place) => {
    localityGroups.set(place.locality, [...(localityGroups.get(place.locality) ?? []), place])
  })
  markerMap.forEach(({ marker }, placeId) => {
    if (!activeIds.has(placeId)) {
      marker.remove()
      markerMap.delete(placeId)
    }
  })

  places.forEach((place) => {
    const localityPlaces = localityGroups.get(place.locality) ?? [place]
    const localityIndex = localityPlaces.findIndex((item) => item.id === place.id)
    const horizontalOffset = (localityIndex - (localityPlaces.length - 1) / 2) * 44
    let value = markerMap.get(place.id)
    if (!value) {
      const category = categoryById[place.categoryId]
      const element = document.createElement('button')
      element.className = 'travel-place-marker'
      element.type = 'button'
      element.setAttribute('aria-label', `Abrir ${place.name}`)
      element.style.setProperty('--marker-color', category?.color ?? '#286F67')
      const label = document.createElement('span')
      label.textContent = category?.label.slice(0, 1) ?? 'L'
      element.append(label)
      element.addEventListener('click', () => onSelectPlace(place.id))
      const marker = new maplibregl.Marker({ element, anchor: 'bottom' })
        .setLngLat([place.longitude, place.latitude])
        .addTo(map)
      value = { element, marker }
      markerMap.set(place.id, value)
    }
    value.marker.setOffset([horizontalOffset, 0])
    value.element.dataset.selected = String(place.id === selectedPlaceId)
  })
}

export function TravelMap(props: TravelMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const placeMarkersRef = useRef<Map<string, PlaceMarkerValue>>(new Map())
  const appliedStyleIdRef = useRef(props.styleId)
  const snapshotRef = useRef<MapPropsSnapshot>(props)
  snapshotRef.current = props

  useEffect(() => {
    if (!containerRef.current) return

    let map: MapLibreMap
    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: getStadiaStyle(props.styleId),
        center: [-1.62, 43.42],
        zoom: 9.4,
      })
    } catch {
      props.onMapError('Este navegador no ha podido iniciar el mapa interactivo.')
      return
    }

    mapRef.current = map
    const placeMarkers = placeMarkersRef.current
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
    map.addControl(new maplibregl.FullscreenControl(), 'bottom-right')

    syncPlaceMarkers(
      map,
      placeMarkers,
      snapshotRef.current.places,
      snapshotRef.current.selectedPlaceId,
      (placeId) => snapshotRef.current.onSelectPlace(placeId),
    )
    const initialCoordinates = snapshotRef.current.places.map(
      (place) => [place.longitude, place.latitude] as [number, number],
    )
    if (initialCoordinates.length > 0) {
      const bounds = initialCoordinates.reduce(
        (value, coordinate) => value.extend(coordinate),
        new maplibregl.LngLatBounds(initialCoordinates[0], initialCoordinates[0]),
      )
      map.fitBounds(bounds, {
        padding: {
          top: window.innerWidth < 560 ? 180 : 115,
          right: 90,
          bottom: 80,
          left: 90,
        },
        maxZoom: 12,
        duration: 0,
      })
    }

    const updateBounds = () => {
      const bounds = map.getBounds()
      snapshotRef.current.onBoundsChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      })
    }

    const syncStyle = () => {
      try {
        addAppSourcesAndLayers(map, snapshotRef.current)
        containerRef.current?.setAttribute('data-ready', 'true')
        updateBounds()
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido'
        props.onMapError(`No se pudieron dibujar los lugares: ${message}`)
      }
    }

    const handleMapError = (event: maplibregl.ErrorEvent) => {
      const message = event.error?.message
      if (message) props.onMapError(`El mapa no pudo cargar un recurso: ${message}`)
    }
    map.on('style.load', syncStyle)
    map.on('error', handleMapError)
    map.on('moveend', updateBounds)

    return () => {
      placeMarkers.forEach(({ marker }) => marker.remove())
      placeMarkers.clear()
      map.remove()
      mapRef.current = null
    }
    // El mapa se crea una sola vez; el resto de propiedades se sincronizan en efectos separados.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (map && props.styleId !== appliedStyleIdRef.current) {
      appliedStyleIdRef.current = props.styleId
      containerRef.current?.removeAttribute('data-ready')
      map.setStyle(getStadiaStyle(props.styleId))
    }
  }, [props.styleId])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    syncPlaceMarkers(
      map,
      placeMarkersRef.current,
      props.places,
      props.selectedPlaceId,
      (placeId) => snapshotRef.current.onSelectPlace(placeId),
    )
  }, [props.places, props.selectedPlaceId])

  useEffect(() => {
    const map = mapRef.current
    if (!map?.getSource('route')) return
    setSourceData(map, 'route', routeToGeoJson(props.route))
    if (props.route) {
      const bounds = props.route.bounds
      map.fitBounds([[bounds.west, bounds.south], [bounds.east, bounds.north]], {
        padding: { top: 150, right: 70, bottom: 270, left: 70 },
        maxZoom: 14,
      })
    }
  }, [props.route])

  useEffect(() => {
    const map = mapRef.current
    if (!map?.getSource('user-location')) return
    setSourceData(map, 'user-location', userLocationToGeoJson(props.userLocation))
    if (props.userLocation && !props.route) {
      map.easeTo({ center: [props.userLocation.longitude, props.userLocation.latitude], zoom: 13 })
    }
  }, [props.route, props.userLocation])

  useEffect(() => {
    if (props.active) window.setTimeout(() => mapRef.current?.resize(), 0)
  }, [props.active])

  return <div className="travel-map" ref={containerRef} aria-label="Mapa interactivo del viaje" />
}

import * as maplibregl from 'maplibre-gl'
import type {
  GeoJSONSource,
  Map as MapLibreMap,
  MapLayerMouseEvent,
  StyleSpecification,
} from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useRef } from 'react'
import { categoryById } from '../../data'
import { getStadiaStyleUrl, type MapStyleId } from '../../services/maps/stadiaMapService'
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

function placesToGeoJson(places: TripPlace[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: places.map((place) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [place.longitude, place.latitude] },
      properties: {
        id: place.id,
        name: place.name,
        color: categoryById[place.categoryId]?.color ?? '#286F67',
        initial: categoryById[place.categoryId]?.label.slice(0, 1) ?? 'L',
      },
    })),
  }
}

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

function selectedRadiusExpression(selectedPlaceId: string | null) {
  return ['case', ['==', ['get', 'id'], selectedPlaceId ?? ''], 13, 10] as maplibregl.ExpressionSpecification
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

  map.addSource('places', {
    type: 'geojson',
    data: placesToGeoJson(snapshot.places),
    cluster: true,
    clusterMaxZoom: 13,
    clusterRadius: 48,
  })
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'places',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': '#254E4B',
      'circle-radius': ['step', ['get', 'point_count'], 18, 5, 22, 10, 27],
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 3,
    },
  })
  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'places',
    filter: ['has', 'point_count'],
    layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 12 },
    paint: { 'text-color': '#ffffff' },
  })
  map.addLayer({
    id: 'place-points',
    type: 'circle',
    source: 'places',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': ['get', 'color'],
      'circle-radius': selectedRadiusExpression(snapshot.selectedPlaceId),
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 3,
      'circle-opacity': 0.98,
    },
  })
  map.addLayer({
    id: 'place-initials',
    type: 'symbol',
    source: 'places',
    filter: ['!', ['has', 'point_count']],
    layout: { 'text-field': ['get', 'initial'], 'text-size': 11, 'text-font': ['Noto Sans Bold'] },
    paint: { 'text-color': '#ffffff' },
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

export function TravelMap(props: TravelMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const snapshotRef = useRef<MapPropsSnapshot>(props)
  snapshotRef.current = props

  useEffect(() => {
    if (!containerRef.current) return

    let map: MapLibreMap
    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: getStadiaStyleUrl(props.styleId),
        center: [-1.62, 43.42],
        zoom: 9.4,
      })
    } catch {
      props.onMapError('Este navegador no ha podido iniciar el mapa interactivo.')
      return
    }

    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
    map.addControl(new maplibregl.FullscreenControl(), 'bottom-right')

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

    const handlePointClick = (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0]
      const placeId = feature?.properties?.id as string | undefined
      if (placeId) snapshotRef.current.onSelectPlace(placeId)
    }

    const handleClusterClick = async (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0]
      const clusterId = feature?.properties?.cluster_id as number | undefined
      if (clusterId === undefined || feature?.geometry.type !== 'Point') return
      const source = map.getSource('places') as GeoJSONSource
      const zoom = await source.getClusterExpansionZoom(clusterId)
      map.easeTo({ center: feature.geometry.coordinates as [number, number], zoom })
    }

    const setPointer = () => { map.getCanvas().style.cursor = 'pointer' }
    const unsetPointer = () => { map.getCanvas().style.cursor = '' }
    const handleMapError = (event: maplibregl.ErrorEvent) => {
      const message = event.error?.message
      if (message) props.onMapError(`El mapa no pudo cargar un recurso: ${message}`)
    }

    map.on('style.load', syncStyle)
    map.on('error', handleMapError)
    map.on('moveend', updateBounds)
    map.on('click', 'place-points', handlePointClick)
    map.on('click', 'clusters', handleClusterClick)
    map.on('mouseenter', 'place-points', setPointer)
    map.on('mouseleave', 'place-points', unsetPointer)
    map.on('mouseenter', 'clusters', setPointer)
    map.on('mouseleave', 'clusters', unsetPointer)

    map.once('load', () => {
      const coordinates = snapshotRef.current.places.map(
        (place) => [place.longitude, place.latitude] as [number, number],
      )
      if (coordinates.length > 0) {
        const bounds = coordinates.reduce(
          (value, coordinate) => value.extend(coordinate),
          new maplibregl.LngLatBounds(coordinates[0], coordinates[0]),
        )
        map.fitBounds(bounds, { padding: 70, maxZoom: 12, duration: 0 })
      }
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
    // El mapa se crea una sola vez; el resto de propiedades se sincronizan en efectos separados.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (map && map.getStyle() && map.isStyleLoaded()) {
      map.setStyle(getStadiaStyleUrl(props.styleId) as string | StyleSpecification)
    }
  }, [props.styleId])

  useEffect(() => {
    const map = mapRef.current
    if (!map?.getSource('places')) return
    setSourceData(map, 'places', placesToGeoJson(props.places))
  }, [props.places])

  useEffect(() => {
    const map = mapRef.current
    if (!map?.getLayer('place-points')) return
    map.setPaintProperty('place-points', 'circle-radius', selectedRadiusExpression(props.selectedPlaceId))
  }, [props.selectedPlaceId])

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

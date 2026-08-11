import * as maplibregl from 'maplibre-gl'
import type { GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Check, Navigation, Star } from 'lucide-react'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Supercluster from 'supercluster'
import { CategoryIcon } from '../../components/categories/CategoryIcon'
import { categoryById } from '../../data'
import { getStadiaStyle, type MapStyleId } from '../../services/maps/stadiaMapService'
import type {
  Coordinate,
  MapBoundsValue,
  PlaceStateMap,
  RouteResult,
  TripPlace,
} from '../../types/data'

interface TravelMapProps {
  active: boolean
  placeStates: PlaceStateMap
  places: TripPlace[]
  route: RouteResult | null
  routeOverlayCompact: boolean
  selectedPlaceId: string | null
  styleId: MapStyleId
  userLocation: Coordinate | null
  onBoundsChange: (bounds: MapBoundsValue) => void
  onMapError: (message: string) => void
  onSelectPlace: (placeId: string) => void
}

export interface TravelMapHandle {
  getViewState: () => TravelMapViewState | null
  restoreViewState: (viewState: TravelMapViewState) => void
  zoomIn: () => void
  zoomOut: () => void
}

export interface TravelMapViewState {
  center: [number, number]
  zoom: number
  bearing: number
  pitch: number
  padding: { top: number; right: number; bottom: number; left: number }
}

interface PlaceClusterProperties {
  placeId: string
}

type MapPropsSnapshot = Pick<
  TravelMapProps,
  | 'placeStates'
  | 'places'
  | 'route'
  | 'routeOverlayCompact'
  | 'selectedPlaceId'
  | 'userLocation'
  | 'onBoundsChange'
  | 'onSelectPlace'
>

interface MarkerValue {
  element: HTMLButtonElement
  marker: maplibregl.Marker
  signature: string
}

const EMPTY_COLLECTION: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] }

function getBrandGreen() {
  return getComputedStyle(document.documentElement).getPropertyValue('--color-primary-strong').trim() || '#00D47F'
}

function routeToGeoJson(route: RouteResult | null): GeoJSON.FeatureCollection {
  if (!route) return EMPTY_COLLECTION
  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: route.coordinates },
      properties: { approximate: route.approximate },
    }],
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
  const brandGreen = getBrandGreen()
  map.addSource('route', { type: 'geojson', data: routeToGeoJson(snapshot.route) })
  map.addLayer({
    id: 'route-outline',
    type: 'line',
    source: 'route',
    paint: { 'line-color': '#ffffff', 'line-width': 12, 'line-opacity': 0.96 },
    layout: { 'line-cap': 'round', 'line-join': 'round' },
  })
  map.addLayer({
    id: 'route-line',
    type: 'line',
    source: 'route',
    paint: { 'line-color': brandGreen, 'line-width': 7, 'line-opacity': 1 },
    layout: { 'line-cap': 'round', 'line-join': 'round' },
  })

  map.addSource('user-location', { type: 'geojson', data: userLocationToGeoJson(snapshot.userLocation) })
  map.addLayer({
    id: 'user-location-halo',
    type: 'circle',
    source: 'user-location',
    paint: { 'circle-color': brandGreen, 'circle-radius': 23, 'circle-opacity': 0.16 },
  })
}

function setSourceData(map: MapLibreMap, sourceId: string, data: GeoJSON.FeatureCollection) {
  const source = map.getSource(sourceId) as GeoJSONSource | undefined
  source?.setData(data)
}

function drawRouteOverlay(
  map: MapLibreMap,
  route: RouteResult | null,
  outline: SVGPathElement | null,
  line: SVGPathElement | null,
) {
  if (!outline || !line) return
  if (!route || route.coordinates.length < 2) {
    outline.setAttribute('d', '')
    line.setAttribute('d', '')
    return
  }

  const path = route.coordinates.map(([longitude, latitude], index) => {
    const point = map.project([longitude, latitude])
    return `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`
  }).join(' ')
  outline.setAttribute('d', path)
  line.setAttribute('d', path)
}

function fitRouteOnMap(map: MapLibreMap, route: RouteResult, compactOverlay: boolean) {
  const bounds = route.bounds
  const wideLayout = window.innerWidth >= 920
  const maxZoom = route.distanceKm < 0.05
    ? 19
    : route.distanceKm < 0.5
      ? 18
      : route.distanceKm < 2
        ? 17
        : 14
  map.fitBounds([[bounds.west, bounds.south], [bounds.east, bounds.north]], {
    padding: compactOverlay
      ? { top: 90, right: 75, bottom: wideLayout ? 110 : 180, left: 75 }
      : wideLayout
        ? { top: 100, right: 90, bottom: 100, left: 500 }
        : { top: 90, right: 65, bottom: Math.min(460, window.innerHeight * 0.58), left: 65 },
    maxZoom,
  })
}

function createClusterIndex(places: TripPlace[]) {
  const points: Array<Supercluster.PointFeature<PlaceClusterProperties>> = places.map((place) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [place.longitude, place.latitude] },
    properties: { placeId: place.id },
  }))
  return new Supercluster<PlaceClusterProperties>({ radius: 44, maxZoom: 8, minPoints: 2 }).load(points)
}

function staticIcon(icon: React.ReactNode) {
  return renderToStaticMarkup(icon)
}

function renderPlaceMarker(
  element: HTMLButtonElement,
  place: TripPlace,
  snapshot: MapPropsSnapshot,
) {
  const category = categoryById[place.categoryId]
  const state = snapshot.placeStates[place.id]
  const selected = snapshot.selectedPlaceId === place.id
  element.className = 'waypoint-marker'
  element.dataset.selected = String(selected)
  element.style.setProperty('--marker-color', category.color)
  element.setAttribute(
    'aria-label',
    `Abrir ${place.name}${state?.favorite ? ', favorito' : ''}${state?.visited ? ', visitado' : ''}`,
  )
  element.replaceChildren()

  const pin = document.createElement('span')
  pin.className = 'waypoint-marker__pin'
  const icon = document.createElement('span')
  icon.className = 'waypoint-marker__icon'
  icon.innerHTML = staticIcon(<CategoryIcon category={category} size={17} strokeWidth={2.35} />)
  element.append(pin, icon)

  if (state?.favorite || state?.visited) {
    const badges = document.createElement('span')
    badges.className = 'waypoint-marker__badges'
    if (state.favorite) {
      const favorite = document.createElement('span')
      favorite.className = 'waypoint-marker__badge waypoint-marker__badge--favorite'
      favorite.innerHTML = staticIcon(<Star size={9} fill="currentColor" strokeWidth={2.6} />)
      badges.append(favorite)
    }
    if (state.visited) {
      const visited = document.createElement('span')
      visited.className = 'waypoint-marker__badge waypoint-marker__badge--visited'
      visited.innerHTML = staticIcon(<Check size={10} strokeWidth={3} />)
      badges.append(visited)
    }
    element.append(badges)
  }
}

function createClusterMarker(count: number) {
  const element = document.createElement('button')
  element.className = 'waypoint-cluster'
  element.type = 'button'
  element.setAttribute('aria-label', `${count} lugares en esta zona; acercar el mapa`)
  const label = document.createElement('span')
  label.textContent = String(count)
  element.append(label)
  return element
}

function createUserLocationMarker() {
  const element = document.createElement('div')
  element.className = 'user-location-marker'
  element.setAttribute('role', 'img')
  element.setAttribute('aria-label', 'Tu ubicación actual')

  const icon = document.createElement('span')
  icon.className = 'user-location-marker__icon'
  icon.innerHTML = staticIcon(<Navigation size={15} fill="currentColor" strokeWidth={2.4} />)
  element.append(icon)
  return element
}

export const TravelMap = forwardRef<TravelMapHandle, TravelMapProps>(function TravelMap(props, ref) {
  const containerRef = useRef<HTMLDivElement>(null)
  const routeLineRef = useRef<SVGPathElement>(null)
  const routeOutlineRef = useRef<SVGPathElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markersRef = useRef<Map<string, MarkerValue>>(new Map())
  const userLocationMarkerRef = useRef<maplibregl.Marker | null>(null)
  const clusterIndexRef = useRef(createClusterIndex(props.places))
  const appliedStyleIdRef = useRef(props.styleId)
  const snapshotRef = useRef<MapPropsSnapshot>(props)
  snapshotRef.current = props

  useImperativeHandle(ref, () => ({
    getViewState: () => {
      const map = mapRef.current
      if (!map) return null
      const center = map.getCenter()
      const padding = map.getPadding()
      return {
        center: [center.lng, center.lat],
        zoom: map.getZoom(),
        bearing: map.getBearing(),
        pitch: map.getPitch(),
        padding: {
          top: padding.top ?? 0,
          right: padding.right ?? 0,
          bottom: padding.bottom ?? 0,
          left: padding.left ?? 0,
        },
      }
    },
    restoreViewState: (viewState) => {
      const map = mapRef.current
      if (!map) return
      map.stop()
      map.easeTo({ ...viewState, duration: 450 })
    },
    zoomIn: () => mapRef.current?.zoomIn(),
    zoomOut: () => mapRef.current?.zoomOut(),
  }), [])

  useEffect(() => {
    if (!containerRef.current) return

    let map: MapLibreMap
    try {
      map = new maplibregl.Map({
        attributionControl: false,
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
    const markers = markersRef.current
    map.addControl(new maplibregl.AttributionControl({ compact: false }), 'bottom-left')

    const updateBounds = () => {
      const bounds = map.getBounds()
      snapshotRef.current.onBoundsChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      })
    }

    const syncRouteOverlay = () => {
      drawRouteOverlay(
        map,
        snapshotRef.current.route,
        routeOutlineRef.current,
        routeLineRef.current,
      )
    }

    const syncMarkers = () => {
      const bounds = map.getBounds()
      const features = clusterIndexRef.current.getClusters(
        [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
        Math.floor(map.getZoom()),
      )
      const activeKeys = new Set<string>()

      features.forEach((feature) => {
        const coordinates = feature.geometry.coordinates as [number, number]
        if ('cluster' in feature.properties && feature.properties.cluster) {
          const { cluster_id: clusterId, point_count: count } = feature.properties
          const key = `cluster-${clusterId}`
          activeKeys.add(key)
          let value = markers.get(key)
          if (!value) {
            const element = createClusterMarker(count)
            value = {
              element,
              marker: new maplibregl.Marker({ element, anchor: 'center' }).setLngLat(coordinates).addTo(map),
              signature: `cluster-${count}`,
            }
            markers.set(key, value)
          } else {
            value.marker.setLngLat(coordinates)
            if (value.signature !== `cluster-${count}`) {
              value.element.firstElementChild!.textContent = String(count)
              value.element.setAttribute('aria-label', `${count} lugares en esta zona; acercar el mapa`)
              value.signature = `cluster-${count}`
            }
          }
          value.element.onclick = () => {
            const zoom = clusterIndexRef.current.getClusterExpansionZoom(clusterId)
            map.easeTo({ center: coordinates, zoom: Math.min(zoom, 16) })
          }
          return
        }

        const placeId = feature.properties.placeId
        const place = snapshotRef.current.places.find((item) => item.id === placeId)
        if (!place) return
        const state = snapshotRef.current.placeStates[placeId]
        const signature = `${placeId}-${Boolean(state?.favorite)}-${Boolean(state?.visited)}-${snapshotRef.current.selectedPlaceId === placeId}`
        const key = `place-${placeId}`
        activeKeys.add(key)
        let value = markers.get(key)
        if (!value) {
          const element = document.createElement('button')
          element.type = 'button'
          element.addEventListener('click', () => snapshotRef.current.onSelectPlace(placeId))
          renderPlaceMarker(element, place, snapshotRef.current)
          value = {
            element,
            marker: new maplibregl.Marker({ element, anchor: 'bottom' })
              .setLngLat([place.longitude, place.latitude])
              .addTo(map),
            signature,
          }
          markers.set(key, value)
        } else {
          value.marker.setLngLat([place.longitude, place.latitude])
          if (value.signature !== signature) {
            renderPlaceMarker(value.element, place, snapshotRef.current)
            value.signature = signature
          }
        }
      })

      markers.forEach(({ marker }, key) => {
        if (!activeKeys.has(key)) {
          marker.remove()
          markers.delete(key)
        }
      })
    }

    const initialCoordinates = snapshotRef.current.places.map(
      (place) => [place.longitude, place.latitude] as [number, number],
    )
    if (initialCoordinates.length > 0) {
      const initialBounds = initialCoordinates.reduce(
        (value, coordinate) => value.extend(coordinate),
        new maplibregl.LngLatBounds(initialCoordinates[0], initialCoordinates[0]),
      )
      map.fitBounds(initialBounds, {
        padding: { top: 110, right: 90, bottom: 90, left: 90 },
        maxZoom: 12,
        duration: 0,
      })
    }
    syncMarkers()

    const syncStyle = () => {
      try {
        addAppSourcesAndLayers(map, snapshotRef.current)
        syncRouteOverlay()
        if (snapshotRef.current.route) {
          fitRouteOnMap(map, snapshotRef.current.route, snapshotRef.current.routeOverlayCompact)
        }
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
    const handleMoveEnd = () => {
      updateBounds()
      syncMarkers()
    }
    map.on('style.load', syncStyle)
    map.on('error', handleMapError)
    map.on('move', syncRouteOverlay)
    map.on('moveend', handleMoveEnd)
    map.on('resize', syncRouteOverlay)

    return () => {
      markers.forEach(({ marker }) => marker.remove())
      markers.clear()
      userLocationMarkerRef.current?.remove()
      userLocationMarkerRef.current = null
      map.off('move', syncRouteOverlay)
      map.off('resize', syncRouteOverlay)
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
    clusterIndexRef.current = createClusterIndex(props.places)
    map.fire('moveend')
  }, [props.placeStates, props.places, props.selectedPlaceId])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    drawRouteOverlay(map, props.route, routeOutlineRef.current, routeLineRef.current)
    if (map.getSource('route')) {
      setSourceData(map, 'route', routeToGeoJson(props.route))
      if (map.getLayer('route-outline')) map.moveLayer('route-outline')
      if (map.getLayer('route-line')) map.moveLayer('route-line')
    }
    if (props.route) {
      fitRouteOnMap(map, props.route, props.routeOverlayCompact)
      map.triggerRepaint()
    }
  }, [props.route, props.routeOverlayCompact])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (map.getSource('user-location')) {
      setSourceData(map, 'user-location', userLocationToGeoJson(props.userLocation))
    }

    if (!props.userLocation) {
      userLocationMarkerRef.current?.remove()
      userLocationMarkerRef.current = null
      return
    }

    const coordinates: [number, number] = [props.userLocation.longitude, props.userLocation.latitude]
    if (!userLocationMarkerRef.current) {
      userLocationMarkerRef.current = new maplibregl.Marker({
        element: createUserLocationMarker(),
        anchor: 'center',
      }).setLngLat(coordinates).addTo(map)
    } else {
      userLocationMarkerRef.current.setLngLat(coordinates)
    }

    map.easeTo({ center: coordinates, zoom: Math.max(map.getZoom(), 14) })
  }, [props.userLocation])

  useEffect(() => {
    if (props.active) window.setTimeout(() => mapRef.current?.resize(), 0)
  }, [props.active])

  return (
    <div className="travel-map-frame">
      <div className="travel-map" ref={containerRef} aria-label="Mapa interactivo del viaje" />
      <svg className="route-map-overlay" aria-hidden="true">
        <path className="route-map-overlay__outline" ref={routeOutlineRef} />
        <path className="route-map-overlay__line" ref={routeLineRef} />
      </svg>
    </div>
  )
})

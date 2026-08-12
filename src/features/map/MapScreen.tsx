import { Layers3, LocateFixed, Minus, Plus, Search, SlidersHorizontal, Triangle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { GeolocationStatus } from '../../hooks/useGeolocation'
import type { MapStyleId } from '../../services/maps/stadiaMapService'
import type {
  Coordinate,
  MapBoundsValue,
  PlaceStateMap,
  PlaceUserState,
  RouteResult,
  RouteStatus,
  TripPlace,
} from '../../types/data'
import { FilterDialog } from '../filters/FilterDialog'
import type { PlaceFilters } from '../filters/placeFilters'
import { PlaceDetails } from '../places/PlaceDetails'
import { RouteStopsDetails } from '../routes/RouteStopsDetails'
import { TravelMap, type TravelMapHandle, type TravelMapViewState } from './TravelMap'

interface MapScreenProps {
  active: boolean
  filters: PlaceFilters
  geolocationStatus: GeolocationStatus
  mapError: string
  mapStyle: MapStyleId
  places: TripPlace[]
  placeStates: PlaceStateMap
  route: RouteResult | null
  routeError: string
  routeGoogleMapsUrl: string
  routePlaceIds: string[]
  routePlaces: TripPlace[]
  routePreview: RouteResult | null
  routeStatus: RouteStatus
  selectedPlace: TripPlace | null
  userLocation: Coordinate | null
  getPlaceState: (placeId: string) => PlaceUserState
  onBoundsChange: (bounds: MapBoundsValue) => void
  onAddPlaceToRoute: (place: TripPlace) => void
  onChangeFilters: (filters: PlaceFilters) => void
  onChangeMapStyle: (style: MapStyleId) => void
  onDeletePlace: (placeId: string) => void
  onHideRoute: () => void
  onMapError: (message: string) => void
  onRemovePlaceFromRoute: (placeId: string) => void
  onRequestLocation: () => void
  onRequestRoute: (place: TripPlace) => void
  onSelectPlace: (placeId: string | null) => void
  onToggleFavorite: (placeId: string) => void
  onToggleVisited: (placeId: string) => void
}

const locationMessages: Partial<Record<GeolocationStatus, string>> = {
  loading: 'Buscando tu ubicación…',
  denied: 'Permiso de ubicación denegado',
  unavailable: 'Ubicación no disponible',
  timeout: 'No se pudo obtener tu ubicación a tiempo',
  error: 'No se pudo obtener tu ubicación',
}

export function MapScreen(props: MapScreenProps) {
  const mapRef = useRef<TravelMapHandle>(null)
  const routeStartViewRef = useRef<TravelMapViewState | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [detailsCompact, setDetailsCompact] = useState(false)
  const [showRouteOverview, setShowRouteOverview] = useState(false)
  const [mapBearing, setMapBearing] = useState(0)
  const routeActive = props.routePlaceIds.length > 0
  const activeFilterCount = props.filters.categoryIds.length
    + Number(props.filters.favoritesOnly)
    + Number(props.filters.unvisitedOnly)

  useEffect(() => {
    setDetailsCompact(false)
    setShowRouteOverview(false)
  }, [props.selectedPlace?.id])

  const restoreViewBeforeRoute = () => {
    const viewState = routeStartViewRef.current
    routeStartViewRef.current = null
    if (viewState) {
      window.requestAnimationFrame(() => mapRef.current?.restoreViewState(viewState))
    }
  }

  const removeRoute = () => {
    props.onHideRoute()
    setDetailsCompact(false)
    setShowRouteOverview(false)
    props.onSelectPlace(null)
    restoreViewBeforeRoute()
  }

  const closePlaceDetails = () => {
    if (routeActive) {
      props.onHideRoute()
      setShowRouteOverview(false)
      restoreViewBeforeRoute()
    }
    props.onSelectPlace(null)
  }

  const requestRoute = () => {
    if (!props.selectedPlace) return
    if (!routeActive) {
      routeStartViewRef.current = mapRef.current?.getViewState() ?? null
    }
    setDetailsCompact(true)
    setShowRouteOverview(false)
    props.onRequestRoute(props.selectedPlace)
  }

  const removeRouteStop = (placeId: string) => {
    const remainingPlaces = props.routePlaces.filter((place) => place.id !== placeId)
    if (props.selectedPlace?.id === placeId) {
      props.onSelectPlace(remainingPlaces[0]?.id ?? null)
    }
    if (remainingPlaces.length <= 1) {
      setShowRouteOverview(false)
      setDetailsCompact(true)
    }
    props.onRemovePlaceFromRoute(placeId)
  }

  return (
    <section className="map-screen" aria-label="Mapa del viaje">
      <TravelMap
        ref={mapRef}
        active={props.active}
        places={props.places}
        placeStates={props.placeStates}
        route={props.route}
        routeOverlayCompact={detailsCompact}
        selectedPlaceId={props.selectedPlace?.id ?? null}
        styleId={props.mapStyle}
        userLocation={props.userLocation}
        onBearingChange={setMapBearing}
        onBoundsChange={props.onBoundsChange}
        onMapError={props.onMapError}
        onSelectPlace={(placeId) => {
          if (routeActive && placeId !== props.selectedPlace?.id) {
            setDetailsCompact(false)
            setShowRouteOverview(false)
          }
          props.onSelectPlace(placeId)
        }}
      />

      <div className="map-topbar">
        <div className="map-tools">
          <label className="search-field search-field--map">
            <Search size={18} aria-hidden="true" />
            <input
              aria-label="Buscar lugares"
              onChange={(event) => props.onChangeFilters({ ...props.filters, query: event.target.value })}
              placeholder="Buscar lugares"
              type="search"
              value={props.filters.query}
            />
          </label>
          <button className="filter-button" onClick={() => setFilterOpen(true)} type="button">
            <SlidersHorizontal size={18} /><span>Filtros{activeFilterCount ? ` (${activeFilterCount})` : ''}</span>
          </button>
        </div>
      </div>

      <div className="map-control-stack" aria-label="Controles del mapa">
        <button
          className="icon-button icon-button--surface map-control-stack__location"
          disabled={props.geolocationStatus === 'loading'}
          onClick={props.onRequestLocation}
          type="button"
          aria-label="Centrar en mi ubicación"
        >
          <LocateFixed size={18} />
        </button>
        <button
          className="icon-button icon-button--surface"
          onClick={() => props.onChangeMapStyle(props.mapStyle === 'outdoors' ? 'satellite' : 'outdoors')}
          type="button"
          aria-label={props.mapStyle === 'outdoors' ? 'Ver mapa por satélite' : 'Ver mapa de exteriores'}
        >
          <Layers3 size={18} />
        </button>
        <button
          className="icon-button icon-button--surface"
          onClick={() => mapRef.current?.zoomIn()}
          type="button"
          aria-label="Acercar mapa"
        >
          <Plus size={18} />
        </button>
        <button
          className="icon-button icon-button--surface"
          onClick={() => mapRef.current?.zoomOut()}
          type="button"
          aria-label="Alejar mapa"
        >
          <Minus size={18} />
        </button>
        <button
          className="icon-button icon-button--surface map-control-stack__compass"
          data-rotated={Math.abs(mapBearing) > 0.1}
          onClick={() => mapRef.current?.resetNorth()}
          type="button"
          aria-label="Orientar el mapa al norte"
          aria-pressed={Math.abs(mapBearing) > 0.1}
          title="Norte arriba"
        >
          <span className="map-north-indicator" style={{ transform: `rotate(${-mapBearing}deg)` }}>
            <span aria-hidden="true">N</span>
            <Triangle size={11} fill="currentColor" strokeWidth={2.2} aria-hidden="true" />
          </span>
        </button>
      </div>

      {locationMessages[props.geolocationStatus] ? (
        <div className="map-status" data-error={['denied', 'unavailable', 'timeout', 'error'].includes(props.geolocationStatus)}>
          {locationMessages[props.geolocationStatus]}
        </div>
      ) : null}
      {props.mapError ? <div className="map-status" data-error="true">{props.mapError}</div> : null}

      {showRouteOverview && props.route && props.routePlaces.length > 1 ? (
        <RouteStopsDetails
          googleMapsUrl={props.routeGoogleMapsUrl}
          route={props.route}
          routeLoading={props.routeStatus === 'loading'}
          routePlaces={props.routePlaces}
          onCollapse={() => {
            setDetailsCompact(true)
            setShowRouteOverview(false)
          }}
          onRemoveStop={removeRouteStop}
          onRemoveRoute={removeRoute}
        />
      ) : props.selectedPlace ? (
        <PlaceDetails
          compact={detailsCompact}
          locationLoading={props.geolocationStatus === 'loading'}
          place={props.selectedPlace}
          route={props.route}
          routeError={props.routeError}
          routeGoogleMapsUrl={props.routeGoogleMapsUrl || props.selectedPlace.googleMapsUrl}
          routeLoading={props.routeStatus === 'loading'}
          routePreview={props.routePreview}
          routeActive={routeActive}
          routeStopCount={props.routePlaceIds.length}
          placeInRoute={props.routePlaceIds.includes(props.selectedPlace.id)}
          state={props.getPlaceState(props.selectedPlace.id)}
          onAddToRoute={() => {
            setDetailsCompact(true)
            setShowRouteOverview(false)
            props.onAddPlaceToRoute(props.selectedPlace!)
          }}
          onCollapse={() => {
            setDetailsCompact(true)
            setShowRouteOverview(false)
          }}
          onClose={closePlaceDetails}
          onDelete={() => props.onDeletePlace(props.selectedPlace!.id)}
          onExpand={() => {
            setDetailsCompact(false)
            setShowRouteOverview(routeActive && props.routePlaces.length > 1)
          }}
          onRemoveRoute={removeRoute}
          onRoute={requestRoute}
          onToggleFavorite={() => props.onToggleFavorite(props.selectedPlace!.id)}
          onToggleVisited={() => props.onToggleVisited(props.selectedPlace!.id)}
        />
      ) : null}

      {filterOpen ? (
        <FilterDialog filters={props.filters} onChange={props.onChangeFilters} onClose={() => setFilterOpen(false)} />
      ) : null}
    </section>
  )
}

import { Layers3, LocateFixed, Minus, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { GeolocationStatus } from '../../hooks/useGeolocation'
import type { MapStyleId } from '../../services/maps/stadiaMapService'
import { calculateRouteEstimate } from '../../services/routing/routeEstimateService'
import type {
  Coordinate,
  MapBoundsValue,
  PlaceStateMap,
  PlaceUserState,
  RouteResult,
  TripPlace,
} from '../../types/data'
import { FilterDialog } from '../filters/FilterDialog'
import type { PlaceFilters } from '../filters/placeFilters'
import { PlaceDetails } from '../places/PlaceDetails'
import { TravelMap, type TravelMapHandle } from './TravelMap'

interface MapScreenProps {
  active: boolean
  filters: PlaceFilters
  geolocationStatus: GeolocationStatus
  mapError: string
  mapStyle: MapStyleId
  places: TripPlace[]
  placeStates: PlaceStateMap
  route: RouteResult | null
  selectedPlace: TripPlace | null
  userLocation: Coordinate | null
  getPlaceState: (placeId: string) => PlaceUserState
  onBoundsChange: (bounds: MapBoundsValue) => void
  onChangeFilters: (filters: PlaceFilters) => void
  onChangeMapStyle: (style: MapStyleId) => void
  onDeletePlace: (placeId: string) => void
  onMapError: (message: string) => void
  onRequestLocation: () => void
  onRequestRoute: (place: TripPlace) => void
  onSelectPlace: (placeId: string | null) => void
  onToggleFavorite: (placeId: string) => void
  onToggleVisited: (placeId: string) => void
}

const locationMessages: Partial<Record<GeolocationStatus, string>> = {
  loading: 'Buscando tu ubicación…',
  success: 'Ubicación activa',
  denied: 'Permiso de ubicación denegado',
  unavailable: 'Ubicación no disponible',
  timeout: 'No se pudo obtener tu ubicación a tiempo',
  error: 'No se pudo obtener tu ubicación',
}

export function MapScreen(props: MapScreenProps) {
  const mapRef = useRef<TravelMapHandle>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [detailsCompact, setDetailsCompact] = useState(false)
  const activeFilterCount = props.filters.categoryIds.length + Number(props.filters.favoritesOnly)
  const routePreview = props.selectedPlace && props.userLocation
    ? calculateRouteEstimate(props.userLocation, {
      latitude: props.selectedPlace.latitude,
      longitude: props.selectedPlace.longitude,
    })
    : null

  useEffect(() => {
    setDetailsCompact(false)
  }, [props.selectedPlace?.id])

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
        onBoundsChange={props.onBoundsChange}
        onMapError={props.onMapError}
        onSelectPlace={(placeId) => props.onSelectPlace(placeId)}
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
          data-active={props.geolocationStatus === 'success' || Boolean(props.userLocation)}
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
      </div>

      {locationMessages[props.geolocationStatus] ? (
        <div className="map-status" data-error={['denied', 'unavailable', 'timeout', 'error'].includes(props.geolocationStatus)}>
          {locationMessages[props.geolocationStatus]}
        </div>
      ) : null}
      {props.mapError ? <div className="map-status" data-error="true">{props.mapError}</div> : null}

      {props.selectedPlace ? (
        <PlaceDetails
          compact={detailsCompact}
          locationLoading={props.geolocationStatus === 'loading'}
          place={props.selectedPlace}
          route={props.route}
          routePreview={routePreview}
          state={props.getPlaceState(props.selectedPlace.id)}
          onClose={() => props.onSelectPlace(null)}
          onDelete={() => props.onDeletePlace(props.selectedPlace!.id)}
          onExpand={() => setDetailsCompact(false)}
          onRoute={() => {
            setDetailsCompact(true)
            props.onRequestRoute(props.selectedPlace!)
          }}
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

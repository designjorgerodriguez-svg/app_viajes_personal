import { Layers3, LocateFixed, Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { TripPickerDialog } from '../../components/trips/TripPickerDialog'
import { TripSelector } from '../../components/trips/TripSelector'
import { trips } from '../../data'
import type { GeolocationStatus } from '../../hooks/useGeolocation'
import type { MapStyleId } from '../../services/maps/stadiaMapService'
import type {
  Coordinate,
  MapBoundsValue,
  PlaceUserState,
  RouteResult,
  TripPlace,
  TripSummary,
} from '../../types/data'
import { FilterDialog } from '../filters/FilterDialog'
import type { PlaceFilters } from '../filters/placeFilters'
import { PlaceDetails } from '../places/PlaceDetails'
import { TravelMap } from './TravelMap'

interface MapScreenProps {
  active: boolean
  activeTrip: TripSummary
  filters: PlaceFilters
  geolocationStatus: GeolocationStatus
  mapError: string
  mapStyle: MapStyleId
  places: TripPlace[]
  route: RouteResult | null
  routeError: string
  routeLoading: boolean
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
  onSelectTrip: (tripId: string) => void
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
  const [tripPickerOpen, setTripPickerOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const activeFilterCount = props.filters.categoryIds.length + Number(props.filters.favoritesOnly)

  return (
    <section className="map-screen" aria-label="Mapa del viaje">
      <TravelMap
        active={props.active}
        places={props.places}
        route={props.route}
        selectedPlaceId={props.selectedPlace?.id ?? null}
        styleId={props.mapStyle}
        userLocation={props.userLocation}
        onBoundsChange={props.onBoundsChange}
        onMapError={props.onMapError}
        onSelectPlace={(placeId) => props.onSelectPlace(placeId)}
      />

      <div className="map-topbar">
        <TripSelector trip={props.activeTrip} onOpen={() => setTripPickerOpen(true)} />
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

      <div className="map-custom-controls">
        <button
          className="icon-button icon-button--surface"
          onClick={() => props.onChangeMapStyle(props.mapStyle === 'outdoors' ? 'satellite' : 'outdoors')}
          type="button"
          aria-label={props.mapStyle === 'outdoors' ? 'Ver mapa por satélite' : 'Ver mapa de exteriores'}
        >
          <Layers3 size={20} />
        </button>
        <button
          className="icon-button icon-button--surface"
          data-active={props.geolocationStatus === 'success'}
          disabled={props.geolocationStatus === 'loading'}
          onClick={props.onRequestLocation}
          type="button"
          aria-label="Centrar en mi ubicación"
        >
          <LocateFixed size={20} />
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
          place={props.selectedPlace}
          route={props.route}
          routeError={props.routeError}
          routeLoading={props.routeLoading}
          state={props.getPlaceState(props.selectedPlace.id)}
          onClose={() => props.onSelectPlace(null)}
          onDelete={() => props.onDeletePlace(props.selectedPlace!.id)}
          onRoute={() => props.onRequestRoute(props.selectedPlace!)}
          onToggleFavorite={() => props.onToggleFavorite(props.selectedPlace!.id)}
          onToggleVisited={() => props.onToggleVisited(props.selectedPlace!.id)}
        />
      ) : null}

      {filterOpen ? (
        <FilterDialog filters={props.filters} onChange={props.onChangeFilters} onClose={() => setFilterOpen(false)} />
      ) : null}
      {tripPickerOpen ? (
        <TripPickerDialog
          activeTripId={props.activeTrip.id}
          trips={trips}
          onClose={() => setTripPickerOpen(false)}
          onSelect={props.onSelectTrip}
        />
      ) : null}
    </section>
  )
}

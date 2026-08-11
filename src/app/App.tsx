import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { OfflineNotice } from '../components/system/OfflineNotice'
import { tripDataById, trips } from '../data'
import { FavoritesScreen } from '../features/favorites/FavoritesPreview'
import { EMPTY_FILTERS, filterPlaces, placeIsInBounds, type PlaceFilters } from '../features/filters/placeFilters'
import { MapScreen } from '../features/map/MapScreen'
import { PlacesScreen } from '../features/places/PlacesPreview'
import { TripsScreen } from '../features/trips/TripsPreview'
import { useGeolocation } from '../hooks/useGeolocation'
import { usePlaceStates } from '../hooks/usePlaceStates'
import { calculateRouteEstimate } from '../services/routing/routeEstimateService'
import type { MapStyleId } from '../services/maps/stadiaMapService'
import type { MapBoundsValue, RouteResult, TripPlace } from '../types/data'
import type { NavigationSection } from '../types/navigation'

function App() {
  const [activeSection, setActiveSection] = useState<NavigationSection>('map')
  const [activeTripId, setActiveTripId] = useState(trips[0].id)
  const [filters, setFilters] = useState<PlaceFilters>(EMPTY_FILTERS)
  const [mapBounds, setMapBounds] = useState<MapBoundsValue | null>(null)
  const [mapError, setMapError] = useState('')
  const [mapStyle, setMapStyle] = useState<MapStyleId>('outdoors')
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [routePlaceId, setRoutePlaceId] = useState<string | null>(null)
  const [pendingRouteId, setPendingRouteId] = useState<string | null>(null)
  const geolocation = useGeolocation()
  const placeStates = usePlaceStates()

  const activeTrip = trips.find((trip) => trip.id === activeTripId) ?? trips[0]
  const activePlaces = useMemo(() => tripDataById[activeTrip.id]?.places ?? [], [activeTrip.id])
  const filteredPlaces = useMemo(
    () => filterPlaces(activePlaces, filters, placeStates.states),
    [activePlaces, filters, placeStates.states],
  )
  const visiblePlaceCount = useMemo(
    () => filteredPlaces.filter((place) => placeIsInBounds(place, mapBounds)).length,
    [filteredPlaces, mapBounds],
  )
  const selectedPlace = filteredPlaces.find((place) => place.id === selectedPlaceId) ?? null
  const favoritePlaces = activePlaces.filter((place) => {
    const state = placeStates.getState(place.id)
    return state.favorite && !state.deleted
  })

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (selectedPlaceId && !filteredPlaces.some((place) => place.id === selectedPlaceId)) {
      setSelectedPlaceId(null)
      setRoute(null)
      setRoutePlaceId(null)
    }
  }, [filteredPlaces, selectedPlaceId])

  const drawRouteEstimate = useCallback((place: TripPlace) => {
    if (!geolocation.coordinate) return
    const destination = {
      latitude: place.latitude,
      longitude: place.longitude,
    }
    setRoute(calculateRouteEstimate(geolocation.coordinate, destination))
    setRoutePlaceId(place.id)
    setPendingRouteId(null)
  }, [geolocation.coordinate])

  useEffect(() => {
    if (!geolocation.coordinate || !pendingRouteId) return
    const place = activePlaces.find((item) => item.id === pendingRouteId)
    if (place) drawRouteEstimate(place)
  }, [activePlaces, drawRouteEstimate, geolocation.coordinate, pendingRouteId])

  const requestRoute = (place: TripPlace) => {
    if (!geolocation.coordinate) {
      setPendingRouteId(place.id)
      geolocation.requestLocation()
      return
    }
    drawRouteEstimate(place)
  }

  const openPlace = (placeId: string) => {
    if (routePlaceId !== placeId) {
      setRoute(null)
      setRoutePlaceId(null)
    }
    setSelectedPlaceId(placeId)
    setActiveSection('map')
  }

  const selectTrip = (tripId: string) => {
    setActiveTripId(tripId)
    setSelectedPlaceId(null)
    setRoute(null)
    setRoutePlaceId(null)
    setFilters(EMPTY_FILTERS)
  }

  const deletePlace = (placeId: string) => {
    placeStates.softDelete(placeId)
    setSelectedPlaceId(null)
    setRoute(null)
    setRoutePlaceId(null)
  }

  const placeCountByTrip = Object.fromEntries(
    trips.map((trip) => [trip.id, tripDataById[trip.id]?.places.length ?? 0]),
  )

  return (
    <>
      <OfflineNotice isOnline={isOnline} />
      <AppShell activeSection={activeSection} onNavigate={setActiveSection}>
        <div className="app-view" data-active={activeSection === 'map'}>
          <MapScreen
            active={activeSection === 'map'}
            filters={filters}
            geolocationStatus={geolocation.status}
            getPlaceState={placeStates.getState}
            mapError={mapError}
            mapStyle={mapStyle}
            places={filteredPlaces}
            placeStates={placeStates.states}
            route={routePlaceId === selectedPlaceId ? route : null}
            selectedPlace={selectedPlace}
            userLocation={geolocation.coordinate}
            onBoundsChange={setMapBounds}
            onChangeFilters={setFilters}
            onChangeMapStyle={setMapStyle}
            onDeletePlace={deletePlace}
            onMapError={setMapError}
            onRequestLocation={geolocation.requestLocation}
            onRequestRoute={requestRoute}
            onSelectPlace={setSelectedPlaceId}
            onToggleFavorite={placeStates.toggleFavorite}
            onToggleVisited={placeStates.toggleVisited}
          />
        </div>
        <div className="app-view" data-active={activeSection === 'places'}>
          <PlacesScreen
            filters={filters}
            getPlaceState={placeStates.getState}
            places={filteredPlaces}
            visibleCount={visiblePlaceCount}
            onChangeFilters={setFilters}
            onOpenPlace={openPlace}
            onToggleFavorite={placeStates.toggleFavorite}
          />
        </div>
        <div className="app-view" data-active={activeSection === 'favorites'}>
          <FavoritesScreen
            getPlaceState={placeStates.getState}
            places={favoritePlaces}
            onExplore={() => setActiveSection('places')}
            onOpenPlace={openPlace}
            onToggleFavorite={placeStates.toggleFavorite}
          />
        </div>
        <div className="app-view" data-active={activeSection === 'trips'}>
          <TripsScreen
            placeCountByTrip={placeCountByTrip}
            trips={trips}
            onOpenTrip={(tripId) => { selectTrip(tripId); setActiveSection('map') }}
          />
        </div>
      </AppShell>
    </>
  )
}

export default App

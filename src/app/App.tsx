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
import type { MapStyleId } from '../services/maps/stadiaMapService'
import { calculateDrivingRoute } from '../services/routing/stadiaRoutingService'
import type { MapBoundsValue, RouteResult, RouteStatus, TripPlace } from '../types/data'
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
  const [visibleRoutePlaceId, setVisibleRoutePlaceId] = useState<string | null>(null)
  const [pendingRouteId, setPendingRouteId] = useState<string | null>(null)
  const [routeStatus, setRouteStatus] = useState<RouteStatus>('idle')
  const [routeError, setRouteError] = useState('')
  const [routeRefreshKey, setRouteRefreshKey] = useState(0)
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
      setVisibleRoutePlaceId(null)
      setPendingRouteId(null)
    }
  }, [filteredPlaces, selectedPlaceId])

  useEffect(() => {
    if (!selectedPlace || !geolocation.coordinate) {
      setRoute(null)
      setRoutePlaceId(null)
      setRouteStatus('idle')
      setRouteError('')
      return
    }

    const controller = new AbortController()
    const placeId = selectedPlace.id
    const origin = geolocation.coordinate
    const destination = {
      latitude: selectedPlace.latitude,
      longitude: selectedPlace.longitude,
    }

    setRoute(null)
    setRoutePlaceId(null)
    setRouteStatus('loading')
    setRouteError('')

    void calculateDrivingRoute(origin, destination, controller.signal)
      .then((result) => {
        setRoute(result)
        setRoutePlaceId(placeId)
        setRouteStatus('success')
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setRoute(null)
        setRoutePlaceId(null)
        setRouteStatus('error')
        setRouteError(error instanceof Error ? error.message : 'No se ha podido calcular el recorrido por carretera.')
      })

    return () => controller.abort()
  }, [geolocation.coordinate, routeRefreshKey, selectedPlace])

  useEffect(() => {
    if (!route || !routePlaceId || pendingRouteId !== routePlaceId) return
    setVisibleRoutePlaceId(routePlaceId)
    setPendingRouteId(null)
  }, [pendingRouteId, route, routePlaceId])

  const requestRoute = (place: TripPlace) => {
    if (!geolocation.coordinate) {
      setPendingRouteId(place.id)
      geolocation.requestLocation()
      return
    }

    if (route && routePlaceId === place.id) {
      setVisibleRoutePlaceId(place.id)
      setPendingRouteId(null)
      return
    }

    setPendingRouteId(place.id)
    if (routeStatus === 'error') setRouteRefreshKey((value) => value + 1)
  }

  const hideRoute = () => {
    setVisibleRoutePlaceId(null)
    setPendingRouteId(null)
  }

  const selectMapPlace = useCallback((placeId: string | null) => {
    if (placeId !== selectedPlaceId) setVisibleRoutePlaceId(null)
    if (!placeId) setPendingRouteId(null)
    setSelectedPlaceId(placeId)
  }, [selectedPlaceId])

  const clearRoute = () => {
    setRoute(null)
    setRoutePlaceId(null)
    setVisibleRoutePlaceId(null)
    setPendingRouteId(null)
    setRouteStatus('idle')
    setRouteError('')
  }

  const openPlace = (placeId: string) => {
    if (routePlaceId !== placeId) {
      clearRoute()
    } else {
      setVisibleRoutePlaceId(null)
      setPendingRouteId(null)
    }
    setSelectedPlaceId(placeId)
    setActiveSection('map')
  }

  const selectTrip = (tripId: string) => {
    setActiveTripId(tripId)
    setSelectedPlaceId(null)
    clearRoute()
    setFilters(EMPTY_FILTERS)
  }

  const deletePlace = (placeId: string) => {
    placeStates.softDelete(placeId)
    setSelectedPlaceId(null)
    clearRoute()
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
            route={routePlaceId === selectedPlaceId && visibleRoutePlaceId === selectedPlaceId ? route : null}
            routeError={routeError}
            routePreview={routePlaceId === selectedPlaceId ? route : null}
            routeStatus={routeStatus}
            selectedPlace={selectedPlace}
            userLocation={geolocation.coordinate}
            onBoundsChange={setMapBounds}
            onChangeFilters={setFilters}
            onChangeMapStyle={setMapStyle}
            onDeletePlace={deletePlace}
            onMapError={setMapError}
            onHideRoute={hideRoute}
            onRequestLocation={geolocation.requestLocation}
            onRequestRoute={requestRoute}
            onSelectPlace={selectMapPlace}
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

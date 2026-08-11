import { useEffect, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { OfflineNotice } from '../components/system/OfflineNotice'
import { FavoritesPreview } from '../features/favorites/FavoritesPreview'
import { MapPreview } from '../features/map/MapPreview'
import { PlacesPreview } from '../features/places/PlacesPreview'
import { TripsPreview } from '../features/trips/TripsPreview'
import type { NavigationSection } from '../types/navigation'

function App() {
  const [activeSection, setActiveSection] = useState<NavigationSection>('map')
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)

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

  const content = {
    map: <MapPreview />,
    places: <PlacesPreview />,
    favorites: <FavoritesPreview />,
    trips: <TripsPreview />,
  } satisfies Record<NavigationSection, React.ReactNode>

  return (
    <>
      <OfflineNotice isOnline={isOnline} />
      <AppShell activeSection={activeSection} onNavigate={setActiveSection}>
        {content[activeSection]}
      </AppShell>
    </>
  )
}

export default App

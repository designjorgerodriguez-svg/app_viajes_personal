import { Heart, MapPinned } from 'lucide-react'
import type { PlaceUserState, TripPlace } from '../../types/data'
import { PlaceCard } from '../places/PlaceCard'

interface FavoritesScreenProps {
  places: TripPlace[]
  getPlaceState: (placeId: string) => PlaceUserState
  onExplore: () => void
  onOpenPlace: (placeId: string) => void
  onToggleFavorite: (placeId: string) => void
}

export function FavoritesScreen({ places, getPlaceState, onExplore, onOpenPlace, onToggleFavorite }: FavoritesScreenProps) {
  return (
    <section className="content-screen content-screen--centerable">
      <header className="content-header">
        <span className="eyebrow">País Vasco francés</span><h1>Favoritos</h1>
        <p>{places.length ? `${places.length} ${places.length === 1 ? 'lugar guardado' : 'lugares guardados'} para este viaje.` : 'Guarda aquí los lugares que no quieres perderte.'}</p>
      </header>
      {places.length ? (
        <div className="place-list">
          {places.map((place) => <PlaceCard key={place.id} place={place} state={getPlaceState(place.id)} onOpen={() => onOpenPlace(place.id)} onToggleFavorite={() => onToggleFavorite(place.id)} />)}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-state__icon" aria-hidden="true"><Heart size={27} /></span>
          <h2>Tu próxima parada favorita</h2><p>Marca un lugar con el corazón y aparecerá en esta lista.</p>
          <button className="secondary-button" onClick={onExplore} type="button"><MapPinned size={18} /> Explorar lugares</button>
        </div>
      )}
    </section>
  )
}

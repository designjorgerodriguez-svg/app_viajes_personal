import { Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { categoryById } from '../../data'
import type { PlaceUserState, TripPlace } from '../../types/data'
import { FilterDialog } from '../filters/FilterDialog'
import type { PlaceFilters } from '../filters/placeFilters'
import { PlaceCard } from './PlaceCard'

interface PlacesScreenProps {
  filters: PlaceFilters
  places: TripPlace[]
  visibleCount: number
  getPlaceState: (placeId: string) => PlaceUserState
  onChangeFilters: (filters: PlaceFilters) => void
  onOpenPlace: (placeId: string) => void
  onToggleFavorite: (placeId: string) => void
}

export function PlacesScreen({ filters, places, visibleCount, getPlaceState, onChangeFilters, onOpenPlace, onToggleFavorite }: PlacesScreenProps) {
  const [filterOpen, setFilterOpen] = useState(false)
  return (
    <section className="content-screen">
      <header className="content-header">
        <span className="eyebrow">País Vasco francés</span>
        <h1>Lugares</h1>
        <p>{places.length} resultados · {visibleCount} visibles en el mapa actual.</p>
      </header>

      <div className="content-toolbar">
        <label className="search-field search-field--page">
          <Search size={19} aria-hidden="true" />
          <input onChange={(event) => onChangeFilters({ ...filters, query: event.target.value })} placeholder="Buscar por nombre o localidad" type="search" value={filters.query} />
        </label>
        <button className="filter-button filter-button--square" onClick={() => setFilterOpen(true)} type="button" aria-label="Abrir filtros">
          <SlidersHorizontal size={19} />
        </button>
      </div>

      <div className="active-filter-row" aria-label="Resumen de filtros">
        <button data-active={filters.categoryIds.length === 0 && !filters.favoritesOnly && !filters.unvisitedOnly} onClick={() => onChangeFilters({ ...filters, categoryIds: [], favoritesOnly: false, unvisitedOnly: false })} type="button">Todos</button>
        {filters.favoritesOnly ? <button data-active="true" type="button">Favoritos</button> : null}
        {filters.unvisitedOnly ? <button data-active="true" type="button">Por visitar</button> : null}
        {filters.categoryIds.map((categoryId) => <button data-active="true" key={categoryId} type="button">{categoryById[categoryId]?.label ?? categoryId}</button>)}
      </div>

      {places.length > 0 ? (
        <div className="place-list">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} state={getPlaceState(place.id)} onOpen={() => onOpenPlace(place.id)} onToggleFavorite={() => onToggleFavorite(place.id)} />
          ))}
        </div>
      ) : (
        <div className="empty-state empty-state--compact">
          <Search className="empty-state__standalone-icon" size={28} />
          <h2>No hay coincidencias</h2><p>Prueba otra búsqueda o limpia los filtros.</p>
        </div>
      )}

      {filterOpen ? <FilterDialog filters={filters} onChange={onChangeFilters} onClose={() => setFilterOpen(false)} /> : null}
    </section>
  )
}

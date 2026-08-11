import {
  CarFront,
  Check,
  Expand,
  Heart,
  Layers3,
  LocateFixed,
  Mountain,
  Search,
  SlidersHorizontal,
  Trees,
  Waves,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { TripPickerDialog } from '../../components/trips/TripPickerDialog'
import { TripSelector } from '../../components/trips/TripSelector'

type PreviewPlace = {
  id: string
  name: string
  category: string
  detail: string
  className: string
  icon: typeof Waves
}

const previewPlaces: PreviewPlace[] = [
  {
    id: 'biarritz',
    name: 'Rocher de la Vierge',
    category: 'Monumento',
    detail: 'Biarritz',
    className: 'marker--terracotta marker--one',
    icon: Mountain,
  },
  {
    id: 'bidart',
    name: 'Plage du Centre',
    category: 'Playa',
    detail: 'Bidart',
    className: 'marker--blue marker--two',
    icon: Waves,
  },
  {
    id: 'ahetze',
    name: 'Bosque de Ahetze',
    category: 'Naturaleza',
    detail: 'Ahetze',
    className: 'marker--green marker--three',
    icon: Trees,
  },
]

export function MapPreview() {
  const [selectedPlace, setSelectedPlace] = useState<PreviewPlace>(previewPlaces[0])
  const [isTripPickerOpen, setTripPickerOpen] = useState(false)
  const [isFavorite, setFavorite] = useState(false)
  const [isVisited, setVisited] = useState(false)

  return (
    <section className="map-screen" aria-label="Mapa del viaje">
      <div className="map-canvas" role="img" aria-label="Vista preliminar del mapa del País Vasco Francés">
        <div className="map-water" aria-hidden="true" />
        <div className="map-park map-park--one" aria-hidden="true" />
        <div className="map-park map-park--two" aria-hidden="true" />
        <div className="map-road map-road--one" aria-hidden="true" />
        <div className="map-road map-road--two" aria-hidden="true" />
        <div className="map-road map-road--three" aria-hidden="true" />
        <span className="map-label map-label--one">Biarritz</span>
        <span className="map-label map-label--two">Bidart</span>
        <span className="map-label map-label--three">Ahetze</span>

        {previewPlaces.map((place) => {
          const Icon = place.icon
          const isSelected = selectedPlace.id === place.id
          return (
            <button
              aria-label={`Abrir ${place.name}`}
              className={`map-marker ${place.className}`}
              data-selected={isSelected}
              key={place.id}
              onClick={() => setSelectedPlace(place)}
              type="button"
            >
              <Icon size={17} strokeWidth={2.4} />
            </button>
          )
        })}
      </div>

      <div className="map-topbar">
        <TripSelector onOpen={() => setTripPickerOpen(true)} />
        <div className="map-topbar__actions">
          <button className="icon-button icon-button--surface" type="button" aria-label="Buscar lugares">
            <Search size={20} />
          </button>
          <button className="filter-button" type="button">
            <SlidersHorizontal size={18} />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      <div className="map-controls" aria-label="Controles del mapa">
        <button className="icon-button icon-button--surface" type="button" aria-label="Cambiar estilo del mapa">
          <Layers3 size={20} />
        </button>
        <button className="icon-button icon-button--surface" type="button" aria-label="Centrar en mi ubicación">
          <LocateFixed size={20} />
        </button>
        <button className="icon-button icon-button--surface map-expand" type="button" aria-label="Pantalla completa">
          <Expand size={19} />
        </button>
      </div>

      <article className="place-peek" aria-live="polite">
        <div className="place-peek__handle" aria-hidden="true" />
        <div className="place-peek__body">
          <div className="place-peek__art" aria-hidden="true">
            <span className="place-peek__sun" />
            <span className="place-peek__hill" />
          </div>
          <div className="place-peek__content">
            <div className="place-peek__heading">
              <div>
                <span className="category-label">{selectedPlace.category}</span>
                <h1>{selectedPlace.name}</h1>
                <p>{selectedPlace.detail}</p>
              </div>
              <button
                className="icon-button icon-button--soft"
                data-active={isFavorite}
                onClick={() => setFavorite((value) => !value)}
                type="button"
                aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              >
                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="place-peek__meta">
              <button type="button" onClick={() => setVisited((value) => !value)}>
                {isVisited ? <Check size={15} /> : <X size={15} />}
                {isVisited ? 'Visitado' : 'Sin visitar'}
              </button>
              <span>Información local</span>
            </div>

            <button className="route-button" type="button">
              <CarFront size={19} />
              Ver ruta
            </button>
          </div>
        </div>
      </article>

      {isTripPickerOpen ? <TripPickerDialog onClose={() => setTripPickerOpen(false)} /> : null}
    </section>
  )
}

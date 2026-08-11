import { Check, PawPrint, Star } from 'lucide-react'
import { CategoryIcon } from '../../components/categories/CategoryIcon'
import { categoryById } from '../../data'
import type { PlaceUserState, TripPlace } from '../../types/data'

interface PlaceCardProps {
  place: TripPlace
  state: PlaceUserState
  onOpen: () => void
  onToggleFavorite: () => void
}

const dogLabels = {
  allowed: 'Admite perros',
  conditional: 'Perros con condiciones',
  'not-allowed': 'No admite perros',
  unknown: 'Perros: sin verificar',
}

export function PlaceCard({ place, state, onOpen, onToggleFavorite }: PlaceCardProps) {
  const category = categoryById[place.categoryId]
  return (
    <article className="place-card">
      <button
        className="place-card__visual"
        onClick={onOpen}
        style={{ color: category.color, backgroundColor: `${category.color}18` }}
        type="button"
        aria-label={`Abrir ${place.name} en el mapa`}
      >
        {place.imageUrl ? <img alt="" decoding="async" loading="lazy" src={place.imageUrl} /> : null}
        <span className="place-card__category" aria-hidden="true">
          <CategoryIcon category={category} size={19} />
        </span>
      </button>
      <button className="place-card__content" onClick={onOpen} type="button">
        <span className="category-label" style={{ color: category.color }}>{category.label}</span>
        <h2>{place.name}</h2>
        <p>{place.locality}</p>
        <span className="place-card__note">
          {state.visited ? <Check size={14} /> : <PawPrint size={14} />}
          {state.visited ? 'Visitado' : dogLabels[place.dogAccess]}
        </span>
      </button>
      <button
        className="icon-button icon-button--ghost"
        data-active={state.favorite}
        onClick={onToggleFavorite}
        type="button"
        aria-label={state.favorite ? `Quitar ${place.name} de favoritos` : `Añadir ${place.name} a favoritos`}
      >
        <Star size={19} fill={state.favorite ? 'currentColor' : 'none'} />
      </button>
    </article>
  )
}

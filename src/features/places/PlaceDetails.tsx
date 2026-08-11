import {
  Check,
  CircleHelp,
  ExternalLink,
  Lightbulb,
  Map,
  PawPrint,
  Route,
  Star,
  Ticket,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react'
import { CategoryIcon } from '../../components/categories/CategoryIcon'
import { categoryById } from '../../data'
import type { PlaceUserState, RouteResult, TripPlace } from '../../types/data'

interface PlaceDetailsProps {
  place: TripPlace
  state: PlaceUserState
  route: RouteResult | null
  routeError: string
  routeLoading: boolean
  onClose: () => void
  onDelete: () => void
  onRoute: () => void
  onToggleFavorite: () => void
  onToggleVisited: () => void
}

const dogInfo = {
  allowed: { label: 'Admite perros', icon: PawPrint },
  conditional: { label: 'Perros con condiciones', icon: PawPrint },
  'not-allowed': { label: 'No admite perros', icon: TriangleAlert },
  unknown: { label: 'Acceso con perros sin verificar', icon: CircleHelp },
}

export function PlaceDetails({
  place,
  state,
  route,
  routeError,
  routeLoading,
  onClose,
  onDelete,
  onRoute,
  onToggleFavorite,
  onToggleVisited,
}: PlaceDetailsProps) {
  const category = categoryById[place.categoryId]
  const dog = dogInfo[place.dogAccess]
  const DogIcon = dog.icon

  const confirmDelete = () => {
    if (window.confirm(`¿Ocultar “${place.name}” de Brújula?`)) onDelete()
  }

  return (
    <article className="place-details" aria-live="polite">
      <div className="place-details__handle" aria-hidden="true" />
      {place.imageUrl ? (
        <figure className="place-details__cover">
          <img alt={place.alt} decoding="async" src={place.imageUrl} />
          <figcaption>
            <a href={place.imageSourceUrl} target="_blank" rel="noreferrer">
              {place.imageAttribution}<ExternalLink size={11} aria-hidden="true" />
            </a>
          </figcaption>
        </figure>
      ) : null}
      <header className="place-details__header">
        <div className="place-details__category-icon" style={{ color: category.color, background: `${category.color}18` }}>
          <CategoryIcon category={category} size={23} />
        </div>
        <div>
          <span className="category-label" style={{ color: category.color }}>{category.label}</span>
          <h1>{place.name}</h1>
          <p>{place.locality}</p>
        </div>
        <div className="place-details__header-actions">
          <button
            className="icon-button icon-button--state"
            data-active={state.favorite}
            onClick={onToggleFavorite}
            type="button"
            aria-label={state.favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            aria-pressed={state.favorite}
          >
            <Star size={17} fill={state.favorite ? 'currentColor' : 'none'} />
          </button>
          <button
            className="icon-button icon-button--state"
            data-active={state.visited}
            onClick={onToggleVisited}
            type="button"
            aria-label={state.visited ? 'Marcar como no visitado' : 'Marcar como visitado'}
            aria-pressed={state.visited}
          >
            <Check size={18} strokeWidth={2.5} />
          </button>
          <button className="icon-button icon-button--ghost" onClick={onClose} type="button" aria-label="Cerrar ficha">
            <X size={19} />
          </button>
        </div>
      </header>

      <div className="place-details__scroll">
        {place.description ? <p className="place-description">{place.description}</p> : null}

        <div className="detail-facts">
          <div>
            <DogIcon size={18} />
            <span><strong>{dog.label}</strong>{place.dogNotes ? <small>{place.dogNotes}</small> : null}</span>
          </div>
          {place.price ? (
            <div>
              <Ticket size={18} />
              <span><strong>{place.price.label}</strong></span>
            </div>
          ) : null}
        </div>

        {place.tips.length > 0 ? (
          <div className="tips-box">
            <Lightbulb size={18} />
            <div><strong>Conviene saber</strong>{place.tips.map((tip) => <p key={tip}>{tip}</p>)}</div>
          </div>
        ) : null}

        {route ? (
          <div className="route-summary">
            <Route size={19} />
            <span><strong>{route.distanceKm.toFixed(1)} km</strong><small>Unos {route.durationMinutes} min en coche</small></span>
            <button onClick={onRoute} type="button" disabled={routeLoading}>Actualizar</button>
          </div>
        ) : null}
        {routeError ? <p className="inline-error">{routeError}</p> : null}

        <div className="place-links">
          <a href={place.googleMapsUrl} target="_blank" rel="noreferrer">
            <Map size={17} /> Abrir navegación <ExternalLink size={14} />
          </a>
          {place.officialSourceUrl ? (
            <a href={place.officialSourceUrl} target="_blank" rel="noreferrer">
              Fuente oficial <ExternalLink size={14} />
            </a>
          ) : null}
        </div>

        <button className="delete-place-button" onClick={confirmDelete} type="button">
          <Trash2 size={16} /> Ocultar lugar
        </button>
      </div>

      <button className="route-button route-button--large" disabled={routeLoading} onClick={onRoute} type="button">
        <Route size={19} />
        {routeLoading ? 'Calculando ruta…' : route ? 'Recalcular desde mi ubicación' : 'Ruta desde mi ubicación'}
      </button>
    </article>
  )
}

import {
  Check,
  CircleHelp,
  ExternalLink,
  Lightbulb,
  LocateFixed,
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
  locationLoading: boolean
  place: TripPlace
  state: PlaceUserState
  route: RouteResult | null
  routePreview: RouteResult | null
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
  locationLoading,
  place,
  state,
  route,
  routePreview,
  onClose,
  onDelete,
  onRoute,
  onToggleFavorite,
  onToggleVisited,
}: PlaceDetailsProps) {
  const category = categoryById[place.categoryId]
  const dog = dogInfo[place.dogAccess]
  const DogIcon = dog.icon
  const visibleRoute = route ?? routePreview
  const routeIsApproximate = !route || route.approximate
  const distancePrefix = routeIsApproximate ? '≈ ' : ''
  const routeDescription = locationLoading && route
    ? 'La línea azul ya está visible; actualizando tu posición…'
    : route
      ? route.approximate
        ? 'Estimación directa orientativa'
        : 'Recorrido aproximado en coche'
      : 'Estimación directa; pulsa para dibujar la línea azul'

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

      <div className="route-summary route-summary--footer" data-drawn={Boolean(route)}>
        {visibleRoute ? <Route size={19} /> : <LocateFixed size={19} />}
        <span>
          <strong>
            {visibleRoute
              ? `${distancePrefix}${visibleRoute.distanceKm.toFixed(1)} km · ${distancePrefix}${visibleRoute.durationMinutes} min`
              : 'Distancia desde tu ubicación'}
          </strong>
          <small>{visibleRoute ? routeDescription : 'Activa tu ubicación para ver kilómetros y minutos'}</small>
        </span>
      </div>
      <button className="route-button route-button--large" disabled={locationLoading} onClick={onRoute} type="button">
        <Route size={19} />
        {locationLoading
          ? route ? 'Actualizando ubicación…' : 'Obteniendo ubicación…'
          : route ? 'Actualizar línea desde mi ubicación' : 'Dibujar línea desde mi ubicación'}
      </button>
    </article>
  )
}

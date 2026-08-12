import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  ExternalLink,
  Lightbulb,
  ListPlus,
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
import { categoryById } from '../../data'
import { formatDuration } from '../../utils/formatDuration'
import { WeatherForecastCard } from '../weather/WeatherForecastCard'
import type { PlaceUserState, RouteResult, TripPlace } from '../../types/data'

interface PlaceDetailsProps {
  compact: boolean
  locationLoading: boolean
  place: TripPlace
  state: PlaceUserState
  route: RouteResult | null
  routeError: string
  routeActive: boolean
  routeGoogleMapsUrl: string
  routeLoading: boolean
  routePreview: RouteResult | null
  routeStopCount: number
  placeInRoute: boolean
  onAddToRoute: () => void
  onCollapse: () => void
  onClose: () => void
  onDelete: () => void
  onExpand: () => void
  onRemoveRoute: () => void
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
  compact,
  locationLoading,
  place,
  state,
  route,
  routeError,
  routeActive,
  routeGoogleMapsUrl,
  routeLoading,
  routePreview,
  routeStopCount,
  placeInRoute,
  onAddToRoute,
  onCollapse,
  onClose,
  onDelete,
  onExpand,
  onRemoveRoute,
  onRoute,
  onToggleFavorite,
  onToggleVisited,
}: PlaceDetailsProps) {
  const category = categoryById[place.categoryId]
  const dog = dogInfo[place.dogAccess]
  const DogIcon = dog.icon
  const visibleRoute = route ?? routePreview
  const routeIsApproximate = Boolean(visibleRoute?.approximate)
  const distancePrefix = routeIsApproximate ? '≈ ' : ''
  const routePending = locationLoading || routeLoading
  const confirmDelete = () => {
    if (window.confirm(`¿Ocultar “${place.name}” de Brújula?`)) onDelete()
  }

  if (compact) {
    return (
      <article className="place-details place-details--compact" aria-live="polite">
        <button className="place-route-peek__main" onClick={onExpand} type="button" aria-label="Mostrar ficha completa">
          <Route size={18} aria-hidden="true" />
          <span>
            <strong>{routeStopCount > 1 ? `Ruta con ${routeStopCount} paradas` : place.name}</strong>
            <small>
              {routeLoading && routeActive
                ? 'Optimizando el orden y el recorrido…'
                : visibleRoute
                ? `${distancePrefix}${visibleRoute.distanceKm.toFixed(1)} km · ${distancePrefix}${formatDuration(visibleRoute.durationMinutes)}`
                : routePending
                  ? locationLoading ? 'Obteniendo tu ubicación…' : 'Calculando por carretera…'
                  : routeError || place.locality}
            </small>
          </span>
          <ChevronUp size={17} aria-hidden="true" />
        </button>
        <button className="icon-button icon-button--ghost" onClick={onRemoveRoute} type="button" aria-label="Quitar ruta del mapa">
          <X size={18} />
        </button>
        {route && routeGoogleMapsUrl ? (
          <a
            className="route-button route-button--compact"
            href={routeGoogleMapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Map size={17} />
            Abrir en Google Maps
            <ExternalLink size={14} />
          </a>
        ) : null}
      </article>
    )
  }

  return (
    <article className="place-details" aria-live="polite">
      <div className="place-details__handle" aria-hidden="true" />
      <header className="place-details__header">
        <div className="place-details__title">
          <h1>{place.name}</h1>
          <p>
            <span className="category-label" style={{ color: category.color }}>{category.label}</span>
            <span aria-hidden="true"> · </span>
            {place.locality}
          </p>
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
          {routeActive ? (
            <button
              className="icon-button icon-button--route-collapse"
              onClick={onCollapse}
              type="button"
              aria-label="Plegar ficha y mantener la ruta"
            >
              <ChevronDown size={18} />
            </button>
          ) : null}
          <button className="icon-button icon-button--ghost" onClick={onClose} type="button" aria-label="Cerrar ficha">
            <X size={19} />
          </button>
        </div>
      </header>
      <div className="place-details__scroll">
        {place.imageUrl ? (
          <figure className="place-details__cover">
            <img alt={place.alt} decoding="async" src={place.imageUrl} />
          </figure>
        ) : null}
        {place.description ? <p className="place-description">{place.description}</p> : null}

        <div className="detail-facts">
          <div data-warning={place.dogAccess === 'not-allowed'}>
            <DogIcon size={18} />
            <span><strong>{dog.label}</strong>{place.dogNotes ? <small>{place.dogNotes}</small> : null}</span>
          </div>
          {place.price ? (
            <div data-warning="true">
              <Ticket size={18} />
              <span><small>{place.price.label}</small></span>
            </div>
          ) : null}
        </div>

        <div className="tips-box">
          <Lightbulb size={18} />
          <div><strong>Consejo para la visita</strong>{place.tips.map((tip) => <p key={tip}>{tip}</p>)}</div>
        </div>

        <div className="place-details__weather-row">
          <WeatherForecastCard
            latitude={place.latitude}
            longitude={place.longitude}
            placeName={place.name}
          />
        </div>
      </div>

      <div className="place-details__quick-actions">
        {routeActive && !placeInRoute ? (
          <button
            className="route-summary route-summary--footer route-summary--add-stop"
            disabled={routePending}
            onClick={onAddToRoute}
            type="button"
            aria-label={`Añadir ${place.name} a la ruta`}
          >
            <ListPlus size={18} />
            <span>
              <strong>Añadir a la ruta</strong>
            </span>
            <ChevronRight className="route-summary__chevron" size={17} aria-hidden="true" />
          </button>
        ) : (
          <button
            className="route-summary route-summary--footer"
            data-drawn={Boolean(route)}
            disabled={routePending}
            onClick={onRoute}
            type="button"
            aria-label={route ? 'Plegar la ficha y mostrar la ruta' : 'Mostrar ruta por carretera'}
          >
            {visibleRoute ? <Route size={18} /> : <LocateFixed size={18} />}
            <span>
              <strong>
                {routeLoading && routeActive
                  ? 'Optimizando el recorrido…'
                  : visibleRoute
                    ? `${distancePrefix}${visibleRoute.distanceKm.toFixed(1)} km · ${distancePrefix}${formatDuration(visibleRoute.durationMinutes)}`
                    : routeLoading ? 'Calculando recorrido por carretera…' : 'Calcular distancia y recorrido'}
              </strong>
            </span>
            <ChevronRight className="route-summary__chevron" size={17} aria-hidden="true" />
          </button>
        )}
        <div className="place-details__aux-actions">
          {place.officialSourceUrl ? (
            <a className="place-source-button" href={place.officialSourceUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={16} />
              <span>Fuente</span>
            </a>
          ) : null}
          <button
            className="delete-place-button"
            onClick={confirmDelete}
            type="button"
            aria-label={`Ocultar ${place.name}`}
            title="Ocultar lugar"
          >
            <Trash2 size={19} />
          </button>
        </div>
      </div>
      {routeError ? <p className="inline-error" role="alert">{routeError}</p> : null}
      {routeGoogleMapsUrl || place.googleMapsUrl ? (
        <a
          className="route-button route-button--large"
          href={routeGoogleMapsUrl || place.googleMapsUrl}
          target="_blank"
          rel="noreferrer"
        >
          <Map size={19} />
          Abrir en Google Maps
          <ExternalLink size={15} />
        </a>
      ) : null}
    </article>
  )
}

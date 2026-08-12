import { ChevronDown, ExternalLink, Map, Navigation, X } from 'lucide-react'
import { categoryById } from '../../data'
import type { RouteResult, TripPlace } from '../../types/data'
import { formatDuration } from '../../utils/formatDuration'

interface RouteStopsDetailsProps {
  googleMapsUrl: string
  route: RouteResult
  routeLoading: boolean
  routePlaces: TripPlace[]
  onCollapse: () => void
  onRemoveStop: (placeId: string) => void
  onRemoveRoute: () => void
}

export function RouteStopsDetails({
  googleMapsUrl,
  route,
  routeLoading,
  routePlaces,
  onCollapse,
  onRemoveStop,
  onRemoveRoute,
}: RouteStopsDetailsProps) {
  return (
    <article className="place-details route-stops-details" aria-live="polite">
      <div className="place-details__handle" aria-hidden="true" />
      <header className="place-details__header">
        <div className="place-details__title">
          <h1>Ruta con {routePlaces.length} paradas</h1>
          <p>
            {routeLoading
              ? 'Actualizando el recorrido…'
              : `${route.distanceKm.toFixed(1)} km · ${formatDuration(route.durationMinutes)} en total`}
          </p>
        </div>
        <div className="place-details__header-actions">
          <button
            className="icon-button icon-button--route-collapse"
            onClick={onCollapse}
            type="button"
            aria-label="Plegar paradas y mantener la ruta"
          >
            <ChevronDown size={18} />
          </button>
          <button
            className="icon-button icon-button--ghost"
            onClick={onRemoveRoute}
            type="button"
            aria-label="Cerrar ruta"
          >
            <X size={19} />
          </button>
        </div>
      </header>

      <ol className="route-stops-list">
        <li className="route-stop route-stop--origin">
          <span className="route-stop__marker"><Navigation size={15} fill="currentColor" /></span>
          <span><strong>Tu ubicación</strong><small>Inicio</small></span>
        </li>
        {routePlaces.map((place, index) => {
          const leg = route.legs[index]
          const category = categoryById[place.categoryId]
          return (
            <li className="route-stop-entry" key={place.id}>
              <div className="route-stop-leg">
                <span aria-hidden="true" />
                <p>
                  {routeLoading
                    ? 'Recalculando…'
                    : leg
                      ? `≈ ${leg.distanceKm.toFixed(1)} km · ${formatDuration(leg.durationMinutes)}`
                      : 'Tramo pendiente'}
                </p>
              </div>
              <div className="route-stop">
                <span className="route-stop__marker" style={{ background: category.color }}>{index + 1}</span>
                <span><strong>{place.name}</strong><small>{place.locality}</small></span>
                <button
                  className="route-stop__remove"
                  disabled={routeLoading}
                  onClick={() => onRemoveStop(place.id)}
                  type="button"
                  aria-label={`Eliminar ${place.name} de la ruta`}
                >
                  <X size={16} strokeWidth={2.4} />
                </button>
              </div>
            </li>
          )
        })}
      </ol>

      {googleMapsUrl ? (
        <a className="route-button route-button--large" href={googleMapsUrl} target="_blank" rel="noreferrer">
          <Map size={19} />
          Abrir en Google Maps
          <ExternalLink size={15} />
        </a>
      ) : null}
    </article>
  )
}

import { CalendarDays, ChevronRight, Map, MapPin, Plus } from 'lucide-react'
import type { TripSummary } from '../../types/data'

interface TripsScreenProps {
  trips: TripSummary[]
  placeCountByTrip: Record<string, number>
  onOpenTrip: (tripId: string) => void
}

const statusLabels = { upcoming: 'Próximo', active: 'Viaje activo', past: 'Pasado' }

export function TripsScreen({ trips, placeCountByTrip, onOpenTrip }: TripsScreenProps) {
  return (
    <section className="content-screen">
      <header className="content-header content-header--with-action">
        <div><span className="eyebrow">Tu colección</span><h1>Viajes</h1><p>Tus próximos viajes y los recuerdos ya recorridos.</p></div>
        <span className="private-pill">Privado</span>
      </header>
      <h2 className="section-title">Tus viajes</h2>
      <div className="trip-list">
        {trips.map((trip) => (
          <article className="trip-card" key={trip.id}>
            <div className="trip-card__map" aria-hidden="true"><Map size={30} /><span className="mini-marker mini-marker--one"><MapPin size={14} /></span><span className="mini-marker mini-marker--two"><MapPin size={14} /></span></div>
            <div className="trip-card__body">
              <span className="status-pill">{statusLabels[trip.status]}</span><h2>{trip.name}</h2>
              <p><CalendarDays size={15} /> {trip.periodLabel}</p><span>{placeCountByTrip[trip.id] ?? 0} lugares preparados</span>
            </div>
            <button className="icon-button icon-button--ghost" onClick={() => onOpenTrip(trip.id)} type="button" aria-label={`Abrir ${trip.name}`}><ChevronRight size={21} /></button>
          </article>
        ))}
      </div>
      <div className="repo-note"><span><Plus size={18} /></span><div><strong>Los viajes se añaden desde los datos privados</strong><p>Así el contenido se puede verificar antes de aparecer en la aplicación.</p></div></div>
    </section>
  )
}

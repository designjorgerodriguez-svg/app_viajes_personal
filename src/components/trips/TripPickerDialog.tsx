import { Check, X } from 'lucide-react'
import type { TripSummary } from '../../types/data'

interface TripPickerDialogProps {
  activeTripId: string
  trips: TripSummary[]
  onClose: () => void
  onSelect: (tripId: string) => void
}

const statusLabels = { upcoming: 'Próximo', active: 'En curso', past: 'Pasado' }

export function TripPickerDialog({ activeTripId, trips, onClose, onSelect }: TripPickerDialogProps) {
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        aria-labelledby="trip-dialog-title"
        aria-modal="true"
        className="trip-dialog"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <header className="dialog-header">
          <div><span className="eyebrow">Viaje activo</span><h2 id="trip-dialog-title">Tus viajes</h2></div>
          <button className="icon-button icon-button--ghost" onClick={onClose} type="button" aria-label="Cerrar">
            <X size={20} />
          </button>
        </header>

        <div className="trip-options">
          {trips.map((trip) => {
            const selected = trip.id === activeTripId
            return (
              <button
                className="trip-option"
                data-selected={selected}
                key={trip.id}
                onClick={() => { onSelect(trip.id); onClose() }}
                type="button"
              >
                <span><strong>{trip.name}</strong><small>{trip.periodLabel} · {statusLabels[trip.status]}</small></span>
                {selected ? <span className="trip-option__check" aria-label="Seleccionado"><Check size={17} /></span> : null}
              </button>
            )
          })}
        </div>
        <p className="dialog-hint">Los próximos viajes aparecerán aquí al añadirlos a los datos privados del proyecto.</p>
      </section>
    </div>
  )
}

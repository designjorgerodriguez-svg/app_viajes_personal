import { Check, Search, X } from 'lucide-react'

interface TripPickerDialogProps {
  onClose: () => void
}

export function TripPickerDialog({ onClose }: TripPickerDialogProps) {
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
          <div>
            <span className="eyebrow">Viaje activo</span>
            <h2 id="trip-dialog-title">Tus viajes</h2>
          </div>
          <button className="icon-button" onClick={onClose} type="button" aria-label="Cerrar">
            <X size={20} />
          </button>
        </header>

        <label className="search-field">
          <Search size={18} aria-hidden="true" />
          <input type="search" placeholder="Buscar viaje" />
        </label>

        <div className="trip-option" data-selected="true">
          <div>
            <strong>País Vasco Francés</strong>
            <span>Agosto 2026 · Próximo</span>
          </div>
          <span className="trip-option__check" aria-label="Seleccionado">
            <Check size={17} />
          </span>
        </div>

        <p className="dialog-hint">
          Los siguientes viajes aparecerán aquí cuando se añadan a los datos del proyecto.
        </p>
      </section>
    </div>
  )
}

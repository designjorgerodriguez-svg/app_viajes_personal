import { CalendarDays, ChevronDown, MapPin } from 'lucide-react'

interface TripSelectorProps {
  onOpen: () => void
}

export function TripSelector({ onOpen }: TripSelectorProps) {
  return (
    <button className="trip-selector" type="button" onClick={onOpen}>
      <span className="trip-selector__icon" aria-hidden="true">
        <MapPin size={18} />
      </span>
      <span className="trip-selector__copy">
        <strong>País Vasco Francés</strong>
        <span>
          <CalendarDays size={13} aria-hidden="true" /> Agosto 2026
        </span>
      </span>
      <ChevronDown size={18} aria-hidden="true" />
    </button>
  )
}

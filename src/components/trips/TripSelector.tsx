import { CalendarDays, ChevronDown, MapPin } from 'lucide-react'
import type { TripSummary } from '../../types/data'

interface TripSelectorProps {
  trip: TripSummary
  onOpen: () => void
}

export function TripSelector({ trip, onOpen }: TripSelectorProps) {
  return (
    <button className="trip-selector" type="button" onClick={onOpen}>
      <span className="trip-selector__icon" aria-hidden="true"><MapPin size={18} /></span>
      <span className="trip-selector__copy">
        <strong>{trip.name}</strong>
        <span><CalendarDays size={13} aria-hidden="true" /> {trip.periodLabel}</span>
      </span>
      <ChevronDown size={18} aria-hidden="true" />
    </button>
  )
}

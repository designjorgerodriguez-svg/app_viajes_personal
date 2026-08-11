import { Heart, Map, MapPinned, Route } from 'lucide-react'
import type { NavigationSection } from '../../types/navigation'

interface BottomNavigationProps {
  activeSection: NavigationSection
  onNavigate: (section: NavigationSection) => void
}

const items: Array<{
  id: NavigationSection
  label: string
  icon: typeof Map
}> = [
  { id: 'map', label: 'Mapa', icon: Map },
  { id: 'places', label: 'Lugares', icon: MapPinned },
  { id: 'favorites', label: 'Favoritos', icon: Heart },
  { id: 'trips', label: 'Viajes', icon: Route },
]

export function BottomNavigation({
  activeSection,
  onNavigate,
}: BottomNavigationProps) {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      <div className="brand-mark" aria-hidden="true">
        B
      </div>
      {items.map(({ id, label, icon: Icon }) => {
        const isActive = activeSection === id

        return (
          <button
            className="nav-item"
            data-active={isActive}
            key={id}
            onClick={() => onNavigate(id)}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            aria-label={label}
          >
            <span className="nav-icon">
              <Icon size={21} strokeWidth={isActive ? 2.4 : 1.9} />
            </span>
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

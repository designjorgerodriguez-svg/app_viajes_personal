import { ChevronDown, ChevronUp, Heart, Map, MapPinned, Route } from 'lucide-react'
import type { NavigationSection } from '../../types/navigation'

interface BottomNavigationProps {
  activeSection: NavigationSection
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
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
  collapsed,
  onCollapsedChange,
  onNavigate,
}: BottomNavigationProps) {
  const navigate = (section: NavigationSection) => {
    onNavigate(section)
    if (window.matchMedia('(max-width: 919px)').matches) onCollapsedChange(true)
  }

  return (
    <nav className="bottom-nav" data-collapsed={collapsed} aria-label="Navegación principal">
      <button
        className="bottom-nav__toggle"
        onClick={() => onCollapsedChange(!collapsed)}
        type="button"
        aria-controls="main-navigation-items"
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Mostrar menú principal' : 'Ocultar menú principal'}
      >
        {collapsed ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
      </button>
      <div className="bottom-nav__items" id="main-navigation-items" aria-hidden={collapsed || undefined}>
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
              onClick={() => navigate(id)}
              tabIndex={collapsed ? -1 : 0}
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
      </div>
    </nav>
  )
}

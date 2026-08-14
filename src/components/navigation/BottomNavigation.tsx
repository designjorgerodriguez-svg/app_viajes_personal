import { ChevronUp, Map, MapPinned, Settings, Star, X } from 'lucide-react'
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
  { id: 'favorites', label: 'Favoritos', icon: Star },
  { id: 'settings', label: 'Configuración', icon: Settings },
]

export function BottomNavigation({
  activeSection,
  collapsed,
  onCollapsedChange,
  onNavigate,
}: BottomNavigationProps) {
  const navigate = (section: NavigationSection) => {
    onNavigate(section)
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
        <span className="bottom-nav__toggle-icon bottom-nav__toggle-icon--open" aria-hidden="true">
          <ChevronUp size={20} strokeWidth={2.8} />
        </span>
        <span className="bottom-nav__toggle-icon bottom-nav__toggle-icon--close" aria-hidden="true">
          <X size={25} strokeWidth={2.6} />
        </span>
      </button>
      <div className="bottom-nav__items" id="main-navigation-items" aria-hidden={collapsed || undefined}>
        <div className="brand-mark" aria-label="Brújula">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" aria-hidden="true" />
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
                <Icon
                  fill={id === 'favorites' && isActive ? 'currentColor' : 'none'}
                  size={21}
                  strokeWidth={isActive ? 2.4 : 1.9}
                />
              </span>
              <span className="nav-label">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

import { ChevronUp, House, Map, MapPinned, Settings, Star, X } from 'lucide-react'
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
  { id: 'map', label: 'Mapa', icon: House },
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
        {collapsed ? <ChevronUp size={17} strokeWidth={2.6} /> : <X size={22} strokeWidth={2.5} />}
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
                <Icon
                  fill={id === 'favorites' && isActive ? 'currentColor' : 'none'}
                  size={21}
                  strokeWidth={isActive ? 2.4 : 1.9}
                />
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

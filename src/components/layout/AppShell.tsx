import { useEffect, useState, type ReactNode } from 'react'
import type { NavigationSection } from '../../types/navigation'
import { BottomNavigation } from '../navigation/BottomNavigation'

interface AppShellProps {
  activeSection: NavigationSection
  children: ReactNode
  onNavigate: (section: NavigationSection) => void
}

export function AppShell({ activeSection, children, onNavigate }: AppShellProps) {
  const [navCollapsed, setNavCollapsed] = useState(false)

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 920px)')
    const handleViewportChange = () => {
      if (desktopQuery.matches) setNavCollapsed(false)
    }
    desktopQuery.addEventListener('change', handleViewportChange)
    return () => desktopQuery.removeEventListener('change', handleViewportChange)
  }, [])

  return (
    <div className="app-shell" data-nav-collapsed={navCollapsed}>
      <BottomNavigation
        activeSection={activeSection}
        collapsed={navCollapsed}
        onCollapsedChange={setNavCollapsed}
        onNavigate={onNavigate}
      />
      <main className="app-main" id="main-content">
        {children}
      </main>
    </div>
  )
}

import type { ReactNode } from 'react'
import type { NavigationSection } from '../../types/navigation'
import { BottomNavigation } from '../navigation/BottomNavigation'

interface AppShellProps {
  activeSection: NavigationSection
  children: ReactNode
  onNavigate: (section: NavigationSection) => void
}

export function AppShell({ activeSection, children, onNavigate }: AppShellProps) {
  return (
    <div className="app-shell">
      <BottomNavigation activeSection={activeSection} onNavigate={onNavigate} />
      <main className="app-main" id="main-content">
        {children}
      </main>
    </div>
  )
}

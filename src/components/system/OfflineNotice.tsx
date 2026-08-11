import { CloudOff } from 'lucide-react'

interface OfflineNoticeProps {
  isOnline: boolean
}

export function OfflineNotice({ isOnline }: OfflineNoticeProps) {
  if (isOnline) return null

  return (
    <div className="offline-notice" role="status">
      <CloudOff size={16} aria-hidden="true" />
      Sin conexión · tus datos guardados siguen disponibles
    </div>
  )
}

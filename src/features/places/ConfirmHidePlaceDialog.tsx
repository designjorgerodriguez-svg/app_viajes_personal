import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { TriangleAlert } from 'lucide-react'

interface ConfirmHidePlaceDialogProps {
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmHidePlaceDialog({ onCancel, onConfirm }: ConfirmHidePlaceDialogProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return createPortal(
    <div className="dialog-backdrop confirm-dialog-backdrop" role="presentation" onMouseDown={onCancel}>
      <section
        aria-describedby="confirm-hide-description"
        aria-labelledby="confirm-hide-title"
        aria-modal="true"
        className="confirm-dialog"
        onMouseDown={(event) => event.stopPropagation()}
        role="alertdialog"
      >
        <span className="confirm-dialog__icon" aria-hidden="true">
          <TriangleAlert size={24} />
        </span>
        <h2 id="confirm-hide-title">Ocultar ubicación</h2>
        <p id="confirm-hide-description">¿Estás seguro de que quieres ocultar esta ubicación?</p>
        <div className="confirm-dialog__actions">
          <button className="confirm-dialog__cancel" onClick={onCancel} type="button" autoFocus>
            Cancelar
          </button>
          <button className="confirm-dialog__confirm" onClick={onConfirm} type="button">
            Confirmar
          </button>
        </div>
      </section>
    </div>,
    document.body,
  )
}

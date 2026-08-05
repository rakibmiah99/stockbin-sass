import { Modal } from './Modal'
import { FormAlert } from './FormAlert'
import { Button } from './Button'

export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = 'Delete', pending, error }: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  pending?: boolean
  error?: string | null
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      {error && <FormAlert>{error}</FormAlert>}
      <p className="text-sm text-muted-foreground mt-1 mb-5">{description}</p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
        <Button variant="danger" size="sm" onClick={onConfirm} disabled={pending}>
          {pending ? 'Deleting…' : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

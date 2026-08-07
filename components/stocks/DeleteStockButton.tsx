'use client'

import { useState, useTransition } from 'react'
import { deleteStockAction } from '@/actions/stocks'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'

export function DeleteStockButton({ id }: { id: number }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleConfirm() {
    setError(null)
    startTransition(async () => {
      const result = await deleteStockAction(id)
      if (result?.error) {
        setError(result.error)
        return
      }
      setOpen(false)
    })
  }

  return (
    <>
      <Button variant="link" className="text-rose-600" onClick={() => setOpen(true)}>Delete</Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        pending={pending}
        error={error}
        title="Delete stock batch"
        description="Are you sure you want to delete this stock batch? This can't be undone."
      />
    </>
  )
}

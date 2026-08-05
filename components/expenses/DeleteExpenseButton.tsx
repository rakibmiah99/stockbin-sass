'use client'

import { useState, useTransition } from 'react'
import { deleteExpenseAction } from '@/actions/expenses'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'

export function DeleteExpenseButton({ id, title }: { id: number; title: string }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleConfirm() {
    setError(null)
    startTransition(async () => {
      const result = await deleteExpenseAction(id)
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
        title="Delete expense"
        description={`Are you sure you want to delete "${title}"? This can't be undone.`}
      />
    </>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { deleteCategoryAction } from '@/actions/categories'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'

export function DeleteCategoryButton({ id, name }: { id: number; name: string }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleConfirm() {
    setError(null)
    startTransition(async () => {
      const result = await deleteCategoryAction(id)
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
        title="Delete category"
        description={`Are you sure you want to delete "${name}"? This can't be undone.`}
      />
    </>
  )
}

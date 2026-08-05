'use client'

import { useState, useTransition } from 'react'
import { createExpenseCategoryAction, updateExpenseCategoryAction } from '@/actions/expense-categories'
import { Modal } from '@/components/ui/Modal'
import { FormAlert } from '@/components/ui/FormAlert'
import { InputGroup } from '@/components/ui/InputGroup'
import { Button } from '@/components/ui/Button'
import type { ExpenseCategory } from '@/types/Expense'

export function ExpenseCategoryFormModal({ open, onClose, category }: {
  open: boolean; onClose: () => void; category: ExpenseCategory | null
}) {
  const isEdit = Boolean(category)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = isEdit
        ? await updateExpenseCategoryAction(category!.id, formData)
        : await createExpenseCategoryAction(formData)
      if (result?.error) {
        setError(result.error)
        return
      }
      onClose()
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit category' : 'Add category'}>
      <form action={handleSubmit} className="space-y-4">
        {error && <FormAlert>{error}</FormAlert>}
        <InputGroup id="name" name="name" label="Category name" required defaultValue={category?.name} />
        <InputGroup id="description" name="description" label="Description (optional)" defaultValue={category?.description ?? ''} />
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" name="is_active" defaultChecked={category?.is_active ?? true} className="rounded border-border accent-primary" />
          Active
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? 'Saving…' : isEdit ? 'Save changes' : 'Add category'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { createExpenseAction, updateExpenseAction } from '@/actions/expenses'
import { createExpenseCategoryAction } from '@/actions/expense-categories'
import { Modal } from '@/components/ui/Modal'
import { FormAlert } from '@/components/ui/FormAlert'
import { InputGroup } from '@/components/ui/InputGroup'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import type { Expense, ExpenseCategory } from '@/types/Expense'

export function ExpenseFormModal({ open, onClose, expense, categories }: {
  open: boolean; onClose: () => void; expense: Expense | null; categories: ExpenseCategory[]
}) {
  const isEdit = Boolean(expense)
  const today = new Date().toISOString().slice(0, 10)

  const [localCategories, setLocalCategories] = useState(categories)
  // The picker only offers active categories — except the expense's own
  // category, so editing an older expense doesn't orphan its selection.
  const selectableCategories = localCategories.filter(c => c.is_active || c.id === expense?.expense_category_id)
  const [categoryId, setCategoryId] = useState<string>(String(expense?.expense_category_id ?? selectableCategories[0]?.id ?? ''))
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [categoryPending, setCategoryPending] = useState(false)

  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = isEdit
        ? await updateExpenseAction(expense!.id, formData)
        : await createExpenseAction(formData)
      if (result?.error) {
        setError(result.error)
        return
      }
      onClose()
    })
  }

  async function handleAddCategory() {
    const name = newCategoryName.trim()
    if (!name) return
    setCategoryPending(true)
    setError(null)
    const formData = new FormData()
    formData.set('name', name)
    formData.set('is_active', 'on')
    const result = await createExpenseCategoryAction(formData)
    setCategoryPending(false)
    if (result?.error) {
      setError(result.error)
      return
    }
    if (result?.category) {
      setLocalCategories(prev => [...prev, result.category!])
      setCategoryId(String(result.category.id))
    }
    setAddingCategory(false)
    setNewCategoryName('')
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit expense' : 'Add expense'}>
      <form action={handleSubmit} className="space-y-4">
        {error && <FormAlert>{error}</FormAlert>}
        <InputGroup id="title" name="title" label="Title" required defaultValue={expense?.title} />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="expense_category_id">Category</Label>
            {!addingCategory && (
              <button type="button" onClick={() => setAddingCategory(true)} className="text-xs text-primary hover:underline">
                + New category
              </button>
            )}
          </div>
          {addingCategory ? (
            <div className="flex gap-2">
              <input
                autoFocus value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-card-foreground text-sm outline-none focus:ring-2 focus:ring-ring transition"
              />
              <Button type="button" size="sm" disabled={categoryPending} onClick={handleAddCategory}>
                {categoryPending ? 'Adding…' : 'Add'}
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={() => { setAddingCategory(false); setNewCategoryName('') }}>
                Cancel
              </Button>
            </div>
          ) : (
            <select
              id="expense_category_id" name="expense_category_id" required
              value={categoryId} onChange={e => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-card-foreground text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="" disabled>Select a category</option>
              {selectableCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
          {!addingCategory && selectableCategories.length === 0 && (
            <p className="text-xs text-muted-foreground mt-1.5">No categories yet — add one above to continue.</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputGroup id="amount" name="amount" type="number" step="0.01" min="0" label="Amount" required defaultValue={expense?.amount} />
          <InputGroup id="expense_date" name="expense_date" type="date" label="Date" required max={today} defaultValue={expense?.expense_date ?? today} />
        </div>
        <InputGroup id="note" name="note" label="Note (optional)" defaultValue={expense?.note ?? ''} />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" disabled={pending || addingCategory || !categoryId}>
            {pending ? 'Saving…' : isEdit ? 'Save changes' : 'Add expense'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

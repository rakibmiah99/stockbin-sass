'use client'

import { useState, useTransition } from 'react'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { FormAlert } from '@/components/ui/FormAlert'
import { InputGroup } from '@/components/ui/InputGroup'
import { Button } from '@/components/ui/Button'

export type VariantItem = { id: number; name: string }
type VariantActionResult = { error?: string } | undefined

export function VariantManager({ title, fieldLabel, items, createAction, updateAction, deleteAction }: {
  title: string
  fieldLabel: string
  items: VariantItem[]
  createAction: (formData: FormData) => Promise<VariantActionResult>
  updateAction: (id: number, formData: FormData) => Promise<VariantActionResult>
  deleteAction: (id: number) => Promise<VariantActionResult>
}) {
  const [formModal, setFormModal] = useState<{ open: boolean; item: VariantItem | null }>({ open: false, item: null })
  const [deleteTarget, setDeleteTarget] = useState<VariantItem | null>(null)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function openCreate() {
    setError(null)
    setFormModal({ open: true, item: null })
  }

  function openEdit(item: VariantItem) {
    setError(null)
    setFormModal({ open: true, item })
  }

  function openDelete(item: VariantItem) {
    setError(null)
    setDeleteTarget(item)
  }

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = formModal.item
        ? await updateAction(formModal.item.id, formData)
        : await createAction(formData)
      if (result?.error) {
        setError(result.error)
        return
      }
      setFormModal({ open: false, item: null })
    })
  }

  function handleDelete() {
    if (!deleteTarget) return
    setError(null)
    startTransition(async () => {
      const result = await deleteAction(deleteTarget.id)
      if (result?.error) {
        setError(result.error)
        return
      }
      setDeleteTarget(null)
    })
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-600 text-sm">{title}</h3>
        <Button size="sm" onClick={openCreate}>+ Add</Button>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">No {title.toLowerCase()} yet.</p>
      ) : (
        <div className="divide-y divide-border">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between py-2.5">
              <span className="text-sm font-500">{item.name}</span>
              <div className="flex items-center gap-3">
                <Button variant="link" onClick={() => openEdit(item)}>Edit</Button>
                <Button variant="link" className="text-rose-600" onClick={() => openDelete(item)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={formModal.open}
        onClose={() => setFormModal({ open: false, item: null })}
        title={formModal.item ? `Edit ${fieldLabel}` : `Add ${fieldLabel}`}
      >
        <form action={handleSubmit} className="space-y-4">
          {error && <FormAlert>{error}</FormAlert>}
          <InputGroup id="name" name="name" label={fieldLabel} required defaultValue={formModal.item?.name} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setFormModal({ open: false, item: null })}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? 'Saving…' : formModal.item ? 'Save changes' : 'Add'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        pending={pending}
        error={error}
        title={`Delete ${fieldLabel.toLowerCase()}`}
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This can't be undone.`}
      />
    </div>
  )
}

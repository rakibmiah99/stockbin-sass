'use client'

import { useState, useTransition } from 'react'
import { createCategoryAction, updateCategoryAction } from '@/actions/categories'
import { Modal } from '@/components/ui/Modal'
import { FormAlert } from '@/components/ui/FormAlert'
import { InputGroup } from '@/components/ui/InputGroup'
import { Label } from '@/components/ui/Label'
import { FileInput } from '@/components/ui/FileInput'
import { Button } from '@/components/ui/Button'
import type { Category } from '@/types/Category'

export function CategoryFormModal({ open, onClose, category }: {
  open: boolean; onClose: () => void; category: Category | null
}) {
  const isEdit = Boolean(category)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = isEdit
        ? await updateCategoryAction(category!.id, formData)
        : await createCategoryAction(formData)
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
        <div>
          <Label htmlFor="image" className="block mb-1.5">Image (optional)</Label>
          <div className="flex items-center gap-4">
            {category?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={category.image} alt={category.name} className="w-14 h-14 rounded-xl object-cover border border-border flex-shrink-0" />
            )}
            <FileInput id="image" name="image" accept="image/png,image/jpeg,image/webp,image/gif" />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">PNG, JPG, WEBP or GIF, up to 2MB.</p>
        </div>
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

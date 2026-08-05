'use client'

import { useState, useTransition } from 'react'
import { sortCategoriesAction } from '@/actions/categories'
import { Modal } from '@/components/ui/Modal'
import { FormAlert } from '@/components/ui/FormAlert'
import { Button } from '@/components/ui/Button'
import type { Category } from '@/types/Category'

export function SortCategoriesModal({ open, onClose, categories }: {
  open: boolean; onClose: () => void; categories: Category[]
}) {
  const [order, setOrder] = useState<Category[]>(categories)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function moveUp(index: number) {
    if (index === 0) return
    setOrder(prev => {
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      return next
    })
  }

  function moveDown(index: number) {
    if (index === order.length - 1) return
    setOrder(prev => {
      const next = [...prev]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      return next
    })
  }

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const result = await sortCategoriesAction(order.map(c => c.id))
      if (result?.error) {
        setError(result.error)
        return
      }
      onClose()
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Sort categories">
      <div className="space-y-4">
        {error && <FormAlert>{error}</FormAlert>}
        <div className="divide-y divide-border max-h-80 overflow-y-auto">
          {order.map((c, i) => (
            <div key={c.id} className="flex items-center justify-between py-2.5">
              <span className="text-sm font-500">{c.name}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button" onClick={() => moveUp(i)} disabled={i === 0}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>
                </button>
                <button
                  type="button" onClick={() => moveDown(i)} disabled={i === order.length - 1}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="button" size="sm" disabled={pending} onClick={handleSave}>
            {pending ? 'Saving…' : 'Save order'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

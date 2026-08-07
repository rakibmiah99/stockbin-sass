'use client'

import { useState, useTransition } from 'react'
import { updateStockAction } from '@/actions/stocks'
import { Modal } from '@/components/ui/Modal'
import { FormAlert } from '@/components/ui/FormAlert'
import { InputGroup } from '@/components/ui/InputGroup'
import { Button } from '@/components/ui/Button'
import type { ProductStock } from '@/types/Stock'

export function EditStockModal({ open, onClose, stock }: { open: boolean; onClose: () => void; stock: ProductStock | null }) {
  const today = new Date().toISOString().slice(0, 10)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  if (!stock) return null

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await updateStockAction(stock!.id, formData)
      if (result?.error) {
        setError(result.error)
        return
      }
      onClose()
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={`Edit stock — ${stock.product.product_name}`}>
      <form action={handleSubmit} className="space-y-4">
        {error && <FormAlert>{error}</FormAlert>}
        <div className="grid grid-cols-2 gap-4">
          <InputGroup id="qty" name="qty" type="number" min="0" step="1" label="Quantity" required defaultValue={stock.qty} />
          <InputGroup id="purchase_unit_cost" name="purchase_unit_cost" type="number" min="0.01" step="0.01" label="Purchase unit cost" required defaultValue={stock.purchase_unit_cost} />
        </div>
        <InputGroup id="stock_date" name="stock_date" type="date" label="Stock date" required max={today} defaultValue={stock.stock_date} />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" disabled={pending}>{pending ? 'Saving…' : 'Save changes'}</Button>
        </div>
      </form>
    </Modal>
  )
}

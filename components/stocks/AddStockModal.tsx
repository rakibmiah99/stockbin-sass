'use client'

import { useState, useTransition } from 'react'
import { createStockAction } from '@/actions/stocks'
import { Modal } from '@/components/ui/Modal'
import { FormAlert } from '@/components/ui/FormAlert'
import { InputGroup } from '@/components/ui/InputGroup'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/types/Product'

const selectClass = 'w-full px-4 py-2.5 rounded-xl border border-border bg-card text-card-foreground text-sm outline-none focus:ring-2 focus:ring-ring'

// Shared across the Stock list, Products list, and Stock history pages so
// "Add stock" always opens the same modal instead of each page having its
// own copy of the form.
export function AddStockModal({ open, onClose, products, defaultProductId }: {
  open: boolean
  onClose: () => void
  products: Product[]
  defaultProductId?: number | string | null
}) {
  const today = new Date().toISOString().slice(0, 10)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await createStockAction(formData)
      if (result?.error) {
        setError(result.error)
        return
      }
      onClose()
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Add stock">
      <form action={handleSubmit} className="space-y-4">
        {error && <FormAlert>{error}</FormAlert>}

        <div>
          <Label htmlFor="product_id" className="block mb-1.5">Product</Label>
          <select id="product_id" name="product_id" required defaultValue={defaultProductId ?? ''} className={selectClass}>
            <option value="" disabled>Select a product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.product_name} ({p.product_code})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputGroup id="qty" name="qty" type="number" min="0" step="1" label="Quantity" required />
          <InputGroup id="purchase_unit_cost" name="purchase_unit_cost" type="number" min="0.01" step="0.01" label="Purchase unit cost" required />
        </div>

        <InputGroup id="stock_date" name="stock_date" type="date" label="Stock date" required max={today} defaultValue={today} />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" disabled={pending}>{pending ? 'Saving…' : 'Add stock'}</Button>
        </div>
      </form>
    </Modal>
  )
}

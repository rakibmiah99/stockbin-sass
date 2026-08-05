'use client'

import { useState, useTransition } from 'react'
import { createProductAction, updateProductAction } from '@/actions/products'
import { Modal } from '@/components/ui/Modal'
import { FormAlert } from '@/components/ui/FormAlert'
import { InputGroup } from '@/components/ui/InputGroup'
import { Label } from '@/components/ui/Label'
import { FileInput } from '@/components/ui/FileInput'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/types/Product'
import type { Category } from '@/types/Category'
import type { Color, Size, Weight, ProductUnit } from '@/types/Variant'

const selectClass = 'w-full px-4 py-2.5 rounded-xl border border-border bg-card text-card-foreground text-sm outline-none focus:ring-2 focus:ring-ring'

export function ProductFormModal({ open, onClose, product, categories, colors, sizes, weights, units }: {
  open: boolean
  onClose: () => void
  product: Product | null
  categories: Category[]
  colors: Color[]
  sizes: Size[]
  weights: Weight[]
  units: ProductUnit[]
}) {
  const isEdit = Boolean(product)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // If the product's current value isn't in the active variant list (e.g. it
  // was free-typed before this list existed, or has since been removed),
  // keep it selectable so editing doesn't silently drop it.
  const unitNotListed = product?.unit && !units.some(u => u.unit_name === product.unit)
  const colorNotListed = product?.color && !colors.some(c => c.color_name === product.color)
  const sizeNotListed = product?.size && !sizes.some(s => s.size_name === product.size)
  const weightNotListed = product?.weight && !weights.some(w => w.weight_name === product.weight)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = isEdit
        ? await updateProductAction(product!.id, formData)
        : await createProductAction(formData)
      if (result?.error) {
        setError(result.error)
        return
      }
      onClose()
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit product' : 'Add product'}>
      <form action={handleSubmit} className="space-y-4">
        {error && <FormAlert>{error}</FormAlert>}
        <InputGroup id="product_name" name="product_name" label="Product name" required defaultValue={product?.product_name} />

        <div>
          <Label htmlFor="category_id" className="block mb-1.5">Category</Label>
          <select id="category_id" name="category_id" required defaultValue={product?.category_id ?? ''} className={selectClass}>
            <option value="" disabled>Select a category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="product_image" className="block mb-1.5">Product image (optional)</Label>
          <div className="flex items-center gap-4">
            {product?.product_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.product_image} alt={product.product_name} className="w-14 h-14 rounded-xl object-cover border border-border flex-shrink-0" />
            )}
            <FileInput id="product_image" name="product_image" accept="image/png,image/jpeg,image/webp,image/gif" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="unit" className="block mb-1.5">Unit</Label>
            <select id="unit" name="unit" defaultValue={product?.unit ?? ''} className={selectClass}>
              <option value="">None</option>
              {unitNotListed && <option value={product!.unit!}>{product!.unit}</option>}
              {units.map(u => (
                <option key={u.id} value={u.unit_name}>{u.unit_name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="color" className="block mb-1.5">Color</Label>
            <select id="color" name="color" defaultValue={product?.color ?? ''} className={selectClass}>
              <option value="">None</option>
              {colorNotListed && <option value={product!.color!}>{product!.color}</option>}
              {colors.map(c => (
                <option key={c.id} value={c.color_name}>{c.color_name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="size" className="block mb-1.5">Size</Label>
            <select id="size" name="size" defaultValue={product?.size ?? ''} className={selectClass}>
              <option value="">None</option>
              {sizeNotListed && <option value={product!.size!}>{product!.size}</option>}
              {sizes.map(s => (
                <option key={s.id} value={s.size_name}>{s.size_name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="weight" className="block mb-1.5">Weight</Label>
            <select id="weight" name="weight" defaultValue={product?.weight ?? ''} className={selectClass}>
              <option value="">None</option>
              {weightNotListed && <option value={product!.weight!}>{product!.weight}</option>}
              {weights.map(w => (
                <option key={w.id} value={w.weight_name}>{w.weight_name}</option>
              ))}
            </select>
          </div>
        </div>

        <InputGroup id="price" name="price" type="number" step="0.01" min="0.01" label="Price" required defaultValue={product?.price} />

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="hidden" name="is_active" value="0" />
          <input type="checkbox" name="is_active" value="1" defaultChecked={product?.is_active ?? true} className="rounded border-border accent-primary" />
          Active
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? 'Saving…' : isEdit ? 'Save changes' : 'Add product'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

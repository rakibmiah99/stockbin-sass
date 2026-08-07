'use client'

import { useState } from 'react'
import { formatMoney } from '@/lib/format'
import { Button, LinkButton } from '@/components/ui/Button'
import { ProductFormModal } from './ProductFormModal'
import { DeleteProductButton } from './DeleteProductButton'
import { AddStockModal } from '@/components/stocks/AddStockModal'
import type { Product } from '@/types/Product'
import type { Category } from '@/types/Category'
import type { Color, Size, Weight, ProductUnit } from '@/types/Variant'

export function ProductsTable({ products, categories, colors, sizes, weights, units, currencySymbol }: {
  products: Product[]
  categories: Category[]
  colors: Color[]
  sizes: Size[]
  weights: Weight[]
  units: ProductUnit[]
  currencySymbol: string
}) {
  const [modal, setModal] = useState<{ open: boolean; product: Product | null }>({ open: false, product: null })
  const [stockModal, setStockModal] = useState<{ open: boolean; productId: number | null }>({ open: false, productId: null })

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-700">Products</h1>
        <Button onClick={() => setModal({ open: true, product: null })}>+ Add product</Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden mt-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Product', 'Code', 'Category', 'Variant', 'Price', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-xs font-600 text-muted-foreground px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">No products yet.</td></tr>
              ) : products.map((p, i) => (
                <tr key={p.id} className={`hover:bg-muted/40 transition-colors ${i < products.length - 1 ? 'border-b border-border' : ''}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {p.product_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.product_image} alt={p.product_name} className="w-8 h-8 rounded-lg object-cover border border-border flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-secondary flex-shrink-0 flex items-center justify-center text-secondary-foreground text-xs font-700">
                          {p.product_name[0]?.toUpperCase()}
                        </div>
                      )}
                      <span className="font-500">{p.product_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{p.product_code}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{p.category?.name ?? '—'}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">
                    {[p.unit, p.color, p.size, p.weight].filter(Boolean).join(' · ') || '—'}
                  </td>
                  <td className="px-5 py-3.5 font-mono font-600">{formatMoney(p.price, currencySymbol)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-mono text-[11px] font-500 px-2 py-0.5 rounded-full ${
                      p.is_active
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'
                    }`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Button variant="link" onClick={() => setModal({ open: true, product: p })}>Edit</Button>
                      <Button variant="link" onClick={() => setStockModal({ open: true, productId: p.id })}>Add stock</Button>
                      <LinkButton variant="link" href={`/stocks/history?product_id=${p.id}`}>History</LinkButton>
                      <DeleteProductButton id={p.id} name={p.product_name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormModal
        open={modal.open}
        product={modal.product}
        onClose={() => setModal({ open: false, product: null })}
        categories={categories}
        colors={colors}
        sizes={sizes}
        weights={weights}
        units={units}
      />

      <AddStockModal
        open={stockModal.open}
        products={products}
        defaultProductId={stockModal.productId ?? undefined}
        onClose={() => setStockModal({ open: false, productId: null })}
      />
    </>
  )
}

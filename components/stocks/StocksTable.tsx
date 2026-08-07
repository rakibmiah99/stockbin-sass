'use client'

import { useState } from 'react'
import { formatMoney } from '@/lib/format'
import { Button, LinkButton } from '@/components/ui/Button'
import { AddStockModal } from './AddStockModal'
import type { Product } from '@/types/Product'
import type { ProductStockSummary } from '@/types/Stock'

export function StocksTable({ stocks, products, currencySymbol }: {
  stocks: ProductStockSummary[]
  products: Product[]
  currencySymbol: string
}) {
  const [modal, setModal] = useState<{ open: boolean; productId: number | null }>({ open: false, productId: null })

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-700">Stock</h1>
        <Button onClick={() => setModal({ open: true, productId: null })}>+ Add stock</Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden mt-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Product', 'Code', 'Category', 'Variant', 'Price', 'Total qty', 'Remaining', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-xs font-600 text-muted-foreground px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stocks.length === 0 ? (
                <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-muted-foreground">No products yet.</td></tr>
              ) : stocks.map((s, i) => (
                <tr key={s.product_id} className={`hover:bg-muted/40 transition-colors ${i < stocks.length - 1 ? 'border-b border-border' : ''}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {s.product_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.product_image} alt={s.product_name} className="w-8 h-8 rounded-lg object-cover border border-border flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-secondary flex-shrink-0 flex items-center justify-center text-secondary-foreground text-xs font-700">
                          {s.product_name[0]?.toUpperCase()}
                        </div>
                      )}
                      <span className="font-500">{s.product_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{s.product_code}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{s.category_name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">
                    {[s.unit, s.color, s.size, s.weight].filter(Boolean).join(' · ') || '—'}
                  </td>
                  <td className="px-5 py-3.5 font-mono font-600">{formatMoney(s.price, currencySymbol)}</td>
                  <td className="px-5 py-3.5">{s.total_qty}</td>
                  <td className="px-5 py-3.5">{s.remaining_qty}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-mono text-[11px] font-500 px-2 py-0.5 rounded-full ${
                      s.stock_alert
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                    }`}>
                      {s.stock_alert ? 'Low stock' : 'In stock'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <LinkButton variant="link" href={`/stocks/history?product_id=${s.product_id}`}>History</LinkButton>
                      <Button variant="link" onClick={() => setModal({ open: true, productId: s.product_id })}>Add stock</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddStockModal
        open={modal.open}
        products={products}
        defaultProductId={modal.productId ?? undefined}
        onClose={() => setModal({ open: false, productId: null })}
      />
    </>
  )
}

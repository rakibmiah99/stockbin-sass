'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { formatMoney } from '@/lib/format'
import { LinkButton, Button } from '@/components/ui/Button'
import { EditStockModal } from './EditStockModal'
import { DeleteStockButton } from './DeleteStockButton'
import type { Product } from '@/types/Product'
import type { ProductStock, StockHistoryPeriod } from '@/types/Stock'

export type StockHistoryFilters = {
  product_id: string
  period: StockHistoryPeriod
  from_date: string
  to_date: string
}

const PERIOD_OPTIONS: { value: StockHistoryPeriod; label: string }[] = [
  { value: 'last_100_records', label: 'Last 100 records' },
  { value: 'last_30_days', label: 'Last 30 days' },
  { value: 'last_60_days', label: 'Last 60 days' },
  { value: 'last_90_days', label: 'Last 90 days' },
  { value: 'custom', label: 'Custom range' },
]

const selectClass = 'text-sm px-3 py-2 rounded-xl border border-border bg-card text-foreground outline-none focus:ring-2 focus:ring-ring'

export function StockHistoryView({ products, history, currencySymbol, filters }: {
  products: Product[]
  history: ProductStock[]
  currencySymbol: string
  filters: StockHistoryFilters
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [modal, setModal] = useState<{ open: boolean; stock: ProductStock | null }>({ open: false, stock: null })

  function updateParams(next: Partial<StockHistoryFilters>) {
    const merged = { ...filters, ...next }
    const query = new URLSearchParams()
    if (merged.product_id) query.set('product_id', merged.product_id)
    if (merged.period !== 'last_100_records') query.set('period', merged.period)
    if (merged.period === 'custom') {
      if (merged.from_date) query.set('from_date', merged.from_date)
      if (merged.to_date) query.set('to_date', merged.to_date)
    }

    const qs = query.toString()
    router.push(`${pathname}${qs ? `?${qs}` : ''}`)
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-700">Stock history</h1>
        <LinkButton variant="secondary" size="sm" href="/stocks">Back to stock</LinkButton>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4">
        <select
          value={filters.product_id}
          onChange={e => updateParams({ product_id: e.target.value })}
          className={selectClass}
        >
          <option value="">Select a product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.product_name} ({p.product_code})</option>
          ))}
        </select>

        <select
          value={filters.period}
          onChange={e => updateParams({ period: e.target.value as StockHistoryPeriod, from_date: '', to_date: '' })}
          className={selectClass}
        >
          {PERIOD_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {filters.period === 'custom' && (
          <>
            <input
              type="date" value={filters.from_date} onChange={e => updateParams({ from_date: e.target.value })}
              className={selectClass}
            />
            <span className="text-muted-foreground text-sm">to</span>
            <input
              type="date" value={filters.to_date} onChange={e => updateParams({ to_date: e.target.value })}
              className={selectClass}
            />
          </>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden mt-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Stock date', 'Purchase cost', 'Qty', 'Remaining', 'Used', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-xs font-600 text-muted-foreground px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!filters.product_id ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">Select a product to view its stock history.</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">No stock history for this product yet.</td></tr>
              ) : history.map((s, i) => (
                <tr key={s.id} className={`hover:bg-muted/40 transition-colors ${i < history.length - 1 ? 'border-b border-border' : ''}`}>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{s.stock_date}</td>
                  <td className="px-5 py-3.5 font-mono font-600">{formatMoney(s.purchase_unit_cost, currencySymbol)}</td>
                  <td className="px-5 py-3.5">{s.qty}</td>
                  <td className="px-5 py-3.5">{s.remaining_qty}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-mono text-[11px] font-500 px-2 py-0.5 rounded-full ${s.is_used ? 'bg-secondary text-secondary-foreground' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'}`}>
                      {s.is_used ? 'Used' : 'Unused'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`font-mono text-[11px] font-500 px-2 py-0.5 rounded-full ${s.stock_alert ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'}`}>
                      {s.stock_alert ? 'Low' : 'OK'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {!s.is_used && (
                      <div className="flex items-center gap-3">
                        <Button variant="link" onClick={() => setModal({ open: true, stock: s })}>Edit</Button>
                        <DeleteStockButton id={s.id} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditStockModal
        open={modal.open}
        stock={modal.stock}
        onClose={() => setModal({ open: false, stock: null })}
      />
    </>
  )
}

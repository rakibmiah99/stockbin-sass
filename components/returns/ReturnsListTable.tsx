'use client'

import { useState, useTransition } from 'react'
import { formatMoney } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { ReturnFilterBar } from './ReturnFilterBar'
import { CreateReturnModal } from './CreateReturnModal'
import { ReturnDetailModal } from './ReturnDetailModal'
import type { SaleReturn, ReturnFilters } from '@/types/SaleReturn'

type FetchDetailResult = { data?: SaleReturn; error?: string } | undefined

// Returns and Wastage are the same resource filtered by disposition, so both
// pages render through this one table — only the copy and the qty column differ.
export function ReturnsListTable({ title, createLabel, qtyLabel, qtyKey, fetchDetail, returns, currencySymbol, filters }: {
  title: string
  createLabel: string
  qtyLabel: string
  qtyKey: 'total_restocked_qty' | 'total_wastage_qty'
  fetchDetail: (id: number) => Promise<FetchDetailResult>
  returns: SaleReturn[]
  currencySymbol: string
  filters: ReturnFilters
}) {
  const [createOpen, setCreateOpen] = useState(false)
  const [detail, setDetail] = useState<SaleReturn | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [pending, startTransition] = useTransition()

  function viewReturn(id: number) {
    setLoadingId(id)
    startTransition(async () => {
      const result = await fetchDetail(id)
      setLoadingId(null)
      if (result?.data) {
        setDetail(result.data)
        setDetailOpen(true)
      }
    })
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-700">{title}</h1>
        <Button onClick={() => setCreateOpen(true)}>{createLabel}</Button>
      </div>

      <div className="mt-4">
        <ReturnFilterBar filters={filters} />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden mt-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Return no', 'Invoice', 'Customer', 'Date', qtyLabel, 'Return value', 'Due adjustment', 'Reason', ''].map(h => (
                  <th key={h} className="text-left text-xs font-600 text-muted-foreground px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {returns.length === 0 ? (
                <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-muted-foreground">Nothing here yet.</td></tr>
              ) : returns.map((r, i) => (
                <tr key={r.id} className={`hover:bg-muted/40 transition-colors ${i < returns.length - 1 ? 'border-b border-border' : ''}`}>
                  <td className="px-5 py-3.5 font-mono text-xs">{r.return_no}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{r.invoice.invoice_no}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-500">{r.customer.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{r.customer.customer_phone}</div>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{r.return_date}</td>
                  <td className="px-5 py-3.5">{r[qtyKey]}</td>
                  <td className="px-5 py-3.5 font-mono font-600">{formatMoney(r.return_value, currencySymbol)}</td>
                  <td className="px-5 py-3.5 font-mono">{formatMoney(r.due_adjustment, currencySymbol)}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs truncate max-w-[160px]">{r.reason || '—'}</td>
                  <td className="px-5 py-3.5">
                    <Button variant="link" onClick={() => viewReturn(r.id)} disabled={pending && loadingId === r.id}>
                      {pending && loadingId === r.id ? 'Loading…' : 'View'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateReturnModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <ReturnDetailModal
        open={detailOpen}
        detail={detail}
        currencySymbol={currencySymbol}
        onClose={() => setDetailOpen(false)}
      />
    </>
  )
}

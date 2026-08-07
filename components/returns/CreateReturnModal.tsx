'use client'

import { useState, useTransition } from 'react'
import type { FormEvent } from 'react'
import { searchInvoicesAction, getInvoiceAction, createReturnAction } from '@/actions/sale-returns'
import { Modal } from '@/components/ui/Modal'
import { FormAlert } from '@/components/ui/FormAlert'
import { InputGroup } from '@/components/ui/InputGroup'
import { Button } from '@/components/ui/Button'
import type { SaleInvoiceListItem, SaleInvoiceDetail } from '@/types/SaleInvoice'

const inputClass = 'w-full px-3 py-2 rounded-lg border border-border bg-card text-card-foreground text-sm outline-none focus:ring-2 focus:ring-ring'

type LineState = Record<number, { restock: string; waste: string; reason: string }>

function returnableItems(invoice: SaleInvoiceDetail) {
  return invoice.items.filter(item => item.sold_qty - item.returned_qty > 0)
}

function emptyLines(invoice: SaleInvoiceDetail): LineState {
  const lines: LineState = {}
  returnableItems(invoice).forEach(item => {
    lines[item.id] = { restock: '', waste: '', reason: '' }
  })
  return lines
}

// Shared by both the Return and Wastage pages — the backend classifies a
// created row as restock-only, wastage-only, or split, based purely on the
// quantities entered here, so one form covers both menus.
export function CreateReturnModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const today = new Date().toISOString().slice(0, 10)

  const [searchValue, setSearchValue] = useState('')
  const [results, setResults] = useState<SaleInvoiceListItem[]>([])
  const [invoice, setInvoice] = useState<SaleInvoiceDetail | null>(null)
  const [lines, setLines] = useState<LineState>({})
  const [returnDate, setReturnDate] = useState(today)
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function reset() {
    setSearchValue('')
    setResults([])
    setInvoice(null)
    setLines({})
    setReturnDate(today)
    setReason('')
    setNote('')
    setError(null)
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!searchValue.trim()) return
    setError(null)
    startTransition(async () => {
      const result = await searchInvoicesAction(searchValue.trim())
      if (result?.error) {
        setError(result.error)
        return
      }
      setResults(result?.invoices ?? [])
    })
  }

  function selectInvoice(id: number) {
    setError(null)
    startTransition(async () => {
      const result = await getInvoiceAction(id)
      if (result?.error) {
        setError(result.error)
        return
      }
      if (result?.invoice) {
        setInvoice(result.invoice)
        setLines(emptyLines(result.invoice))
      }
    })
  }

  function updateLine(itemId: number, field: 'restock' | 'waste' | 'reason', value: string) {
    setLines(prev => ({ ...prev, [itemId]: { ...prev[itemId], [field]: value } }))
  }

  function handleSubmit() {
    if (!invoice) return

    const items = Object.entries(lines)
      .map(([itemId, line]) => {
        const restock = Number(line.restock) || 0
        const waste = Number(line.waste) || 0
        return {
          sale_invoice_item_id: Number(itemId),
          restocked_qty: restock,
          wastage_qty: waste,
          returned_qty: restock + waste,
          reason: line.reason || undefined,
        }
      })
      .filter(item => item.returned_qty > 0)

    if (items.length === 0) {
      setError('Enter a restock or wastage quantity for at least one item.')
      return
    }

    setError(null)
    startTransition(async () => {
      const result = await createReturnAction({
        invoiceId: invoice.id,
        return_date: returnDate,
        reason: reason || undefined,
        note: note || undefined,
        items,
      })
      if (result?.error) {
        setError(result.error)
        return
      }
      handleClose()
    })
  }

  const items = invoice ? returnableItems(invoice) : []

  return (
    <Modal open={open} onClose={handleClose} title="New return / wastage">
      <div className="space-y-4">
        {error && <FormAlert>{error}</FormAlert>}

        {!invoice ? (
          <>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                autoFocus
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="Search invoice no, customer name or phone"
                className={inputClass}
              />
              <Button type="submit" size="sm" disabled={pending}>{pending ? 'Searching…' : 'Search'}</Button>
            </form>

            <div className="max-h-64 overflow-y-auto divide-y divide-border rounded-xl border border-border">
              {results.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Search for a completed invoice to start a return or wastage.</p>
              ) : results.map(inv => (
                <button
                  key={inv.id}
                  type="button"
                  onClick={() => selectInvoice(inv.id)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
                >
                  <div>
                    <div className="text-sm font-500">{inv.invoice_no}</div>
                    <div className="text-xs text-muted-foreground">{inv.customer.customer_name} · {inv.customer.customer_phone}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{inv.invoice_date}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <Button type="button" variant="secondary" size="sm" onClick={handleClose}>Cancel</Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <div>
                <div className="text-sm font-600">{invoice.invoice_no}</div>
                <div className="text-xs text-muted-foreground">{invoice.customer.customer_name} · {invoice.customer.customer_phone}</div>
              </div>
              <Button type="button" variant="link" onClick={() => { setInvoice(null); setLines({}) }}>Change invoice</Button>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No returnable items left on this invoice.</p>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto max-h-72">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {['Product', 'Sold', 'Remaining', 'Restock', 'Waste'].map(h => (
                          <th key={h} className="text-left text-xs font-600 text-muted-foreground px-3 py-2 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => {
                        const remaining = item.sold_qty - item.returned_qty
                        const line = lines[item.id] ?? { restock: '', waste: '', reason: '' }
                        return (
                          <tr key={item.id} className={i > 0 ? 'border-t border-border' : ''}>
                            <td className="px-3 py-2 text-xs">{item.product.product_name}</td>
                            <td className="px-3 py-2 text-xs">{item.sold_qty}</td>
                            <td className="px-3 py-2 text-xs">{remaining}</td>
                            <td className="px-3 py-2">
                              <input
                                type="number" min="0" max={remaining} value={line.restock}
                                onChange={e => updateLine(item.id, 'restock', e.target.value)}
                                className={`${inputClass} w-20`}
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number" min="0" max={remaining} value={line.waste}
                                onChange={e => updateLine(item.id, 'waste', e.target.value)}
                                className={`${inputClass} w-20`}
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <InputGroup
                id="return_date" label="Return date" type="date" required
                min={invoice.invoice_date} max={today} value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
              />
              <InputGroup id="reason" label="Reason (optional)" value={reason} onChange={e => setReason(e.target.value)} />
            </div>
            <InputGroup id="note" label="Note (optional)" value={note} onChange={e => setNote(e.target.value)} />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={handleClose}>Cancel</Button>
              <Button type="button" size="sm" disabled={pending || items.length === 0} onClick={handleSubmit}>
                {pending ? 'Saving…' : 'Submit'}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

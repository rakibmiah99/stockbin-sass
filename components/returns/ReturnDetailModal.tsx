'use client'

import { Modal } from '@/components/ui/Modal'
import { formatMoney } from '@/lib/format'
import type { SaleReturn } from '@/types/SaleReturn'

export function ReturnDetailModal({ open, detail, currencySymbol, onClose }: {
  open: boolean
  detail: SaleReturn | null
  currencySymbol: string
  onClose: () => void
}) {
  if (!detail) return null

  return (
    <Modal open={open} onClose={onClose} title={detail.return_no}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Invoice</div>
            <div className="font-500">{detail.invoice.invoice_no}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Return date</div>
            <div className="font-500">{detail.return_date}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Customer</div>
            <div className="font-500">{detail.customer.customer_name}</div>
            <div className="text-xs text-muted-foreground">{detail.customer.customer_phone}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Reason</div>
            <div className="font-500">{detail.reason || '—'}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border px-3 py-2.5">
            <div className="text-xs text-muted-foreground">Return value</div>
            <div className="font-mono font-600">{formatMoney(detail.return_value, currencySymbol)}</div>
          </div>
          <div className="rounded-xl border border-border px-3 py-2.5">
            <div className="text-xs text-muted-foreground">Due adjustment</div>
            <div className="font-mono font-600">{formatMoney(detail.due_adjustment, currencySymbol)}</div>
          </div>
          <div className="rounded-xl border border-border px-3 py-2.5">
            <div className="text-xs text-muted-foreground">Refund</div>
            <div className="font-mono font-600">{formatMoney(detail.refund_amount, currencySymbol)}</div>
          </div>
        </div>

        {detail.note && (
          <div>
            <div className="text-xs text-muted-foreground mb-1">Note</div>
            <p className="text-sm text-foreground">{detail.note}</p>
          </div>
        )}

        {detail.items && detail.items.length > 0 && (
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Product', 'Returned', 'Restocked', 'Wasted', 'Credit'].map(h => (
                      <th key={h} className="text-left text-xs font-600 text-muted-foreground px-3 py-2 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detail.items.map((item, i) => (
                    <tr key={item.id} className={i > 0 ? 'border-t border-border' : ''}>
                      <td className="px-3 py-2 text-xs">{item.product.product_name}</td>
                      <td className="px-3 py-2 text-xs">{item.returned_qty}</td>
                      <td className="px-3 py-2 text-xs">{item.restocked_qty}</td>
                      <td className="px-3 py-2 text-xs">{item.wastage_qty}</td>
                      <td className="px-3 py-2 text-xs font-mono">{formatMoney(item.return_credit_amount, currencySymbol)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

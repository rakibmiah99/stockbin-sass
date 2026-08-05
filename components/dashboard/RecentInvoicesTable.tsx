import { formatMoney } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import type { DashboardInvoice } from '@/types/Dashboard'

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  partial: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  due: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400',
}

export function RecentInvoicesTable({ invoices, currencySymbol }: { invoices: DashboardInvoice[]; currencySymbol: string }) {
  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-600 text-foreground text-sm">Recent invoices</h3>
        <Button variant="link">View all</Button>
      </div>
      {invoices.length === 0 ? (
        <p className="px-5 py-8 text-sm text-muted-foreground text-center">No invoices yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Invoice', 'Customer', 'Total', 'Due', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left text-xs font-600 text-muted-foreground px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, i) => (
                <tr key={invoice.id} className={`hover:bg-muted/50 transition-colors ${i < invoices.length - 1 ? 'border-b border-border' : ''}`}>
                  <td className="px-5 py-3 font-mono text-xs text-primary font-600">{invoice.invoice_no}</td>
                  <td className="px-5 py-3 font-500">{invoice.customer_name}</td>
                  <td className="px-5 py-3 font-mono font-600">{formatMoney(invoice.grand_total, currencySymbol)}</td>
                  <td className="px-5 py-3 font-mono text-muted-foreground">{formatMoney(invoice.due_amount, currencySymbol)}</td>
                  <td className="px-5 py-3">
                    <span className={`font-mono text-[11px] font-500 px-2 py-0.5 rounded-full ${STATUS_STYLES[invoice.payment_status] ?? ''}`}>
                      {invoice.payment_status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{invoice.invoice_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

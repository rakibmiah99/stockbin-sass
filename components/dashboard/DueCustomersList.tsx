import { formatMoney } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import type { DueCustomer } from '@/types/Dashboard'

export function DueCustomersList({ customers, currencySymbol }: { customers: DueCustomer[]; currencySymbol: string }) {
  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-600 text-foreground text-sm">Due customers</h3>
        <Button variant="link">View all</Button>
      </div>
      {customers.length === 0 ? (
        <p className="px-5 py-8 text-sm text-muted-foreground text-center">No outstanding dues.</p>
      ) : (
        <div className="divide-y divide-border">
          {customers.map(customer => (
            <div key={customer.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-500 truncate">{customer.customer_name}</div>
                <div className="text-xs text-muted-foreground">{customer.customer_phone}</div>
              </div>
              <div className="font-mono text-sm font-600 text-rose-600 dark:text-rose-400">
                {formatMoney(customer.total_due, currencySymbol)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

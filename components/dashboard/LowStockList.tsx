import { Button } from '@/components/ui/Button'
import type { LowStockItem } from '@/types/Dashboard'

export function LowStockList({ items }: { items: LowStockItem[] }) {
  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-600 text-foreground text-sm">Low stock</h3>
        <Button variant="link">View all</Button>
      </div>
      {items.length === 0 ? (
        <p className="px-5 py-8 text-sm text-muted-foreground text-center">Nothing running low.</p>
      ) : (
        <div className="divide-y divide-border">
          {items.map(product => (
            <div key={product.product_id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-500 truncate">{product.product_name}</div>
                <div className="text-xs text-muted-foreground font-mono">{product.product_code}</div>
              </div>
              <div className="font-mono text-sm font-600 text-amber-600 dark:text-amber-400">
                {product.remaining_qty} {product.unit}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

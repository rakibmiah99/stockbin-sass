'use client'

import { useState } from 'react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { recentOrders } from '@/lib/mock-data'

const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered']

export default function OrdersPage() {
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? recentOrders : recentOrders.filter(o => o.status === active)

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-700">Orders</h1>
        <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-600 hover:opacity-90 transition-opacity">Export CSV</button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => setActive(s)} className={`px-3 py-1.5 rounded-xl text-sm font-500 transition-colors ${active === s ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:bg-secondary'}`}>{s}</button>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border">
            {['Order', 'Customer', 'Product', 'Amount', 'Status', 'Date', ''].map(h => (
              <th key={h} className="text-left text-xs font-600 text-muted-foreground px-5 py-3 whitespace-nowrap">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map((o, i) => (
              <tr key={o.id} className={`hover:bg-muted/40 transition-colors ${i < filtered.length - 1 ? 'border-b border-border' : ''}`}>
                <td className="px-5 py-3.5 font-mono text-xs text-primary font-600">{o.id}</td>
                <td className="px-5 py-3.5 font-500">{o.customer}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{o.product}</td>
                <td className="px-5 py-3.5 font-mono font-600">${o.amount.toFixed(2)}</td>
                <td className="px-5 py-3.5"><StatusBadge status={o.status} /></td>
                <td className="px-5 py-3.5 text-muted-foreground text-xs">{o.date}</td>
                <td className="px-5 py-3.5"><button className="text-xs text-primary hover:underline">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

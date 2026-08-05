'use client'

import { useState } from 'react'
import { formatMoney } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { CustomerFormModal } from './CustomerFormModal'
import { DeleteCustomerButton } from './DeleteCustomerButton'
import type { Customer } from '@/types/Customer'

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(part => part[0]).slice(0, 2).join('').toUpperCase()
}

export function CustomersTable({ customers, currencySymbol }: { customers: Customer[]; currencySymbol: string }) {
  const [modal, setModal] = useState<{ open: boolean; customer: Customer | null }>({ open: false, customer: null })

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-700">Customers</h1>
        <Button onClick={() => setModal({ open: true, customer: null })}>+ Add customer</Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden mt-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Customer', 'Phone', 'Total sale', 'Total paid', 'Total due', ''].map(h => (
                  <th key={h} className="text-left text-xs font-600 text-muted-foreground px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">No customers yet.</td></tr>
              ) : customers.map((c, i) => (
                <tr key={c.id} className={`hover:bg-muted/40 transition-colors ${i < customers.length - 1 ? 'border-b border-border' : ''}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/60 to-accent/60 flex-shrink-0 flex items-center justify-center text-white text-xs font-700">
                        {initials(c.customer_name)}
                      </div>
                      <span className="font-500">{c.customer_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs font-mono">{c.customer_phone}</td>
                  <td className="px-5 py-3.5 font-mono">{formatMoney(c.total_sale, currencySymbol)}</td>
                  <td className="px-5 py-3.5 font-mono">{formatMoney(c.total_paid, currencySymbol)}</td>
                  <td className="px-5 py-3.5 font-mono text-rose-600 dark:text-rose-400">{formatMoney(c.total_due, currencySymbol)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Button variant="link" onClick={() => setModal({ open: true, customer: c })}>Edit</Button>
                      <DeleteCustomerButton id={c.id} name={c.customer_name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CustomerFormModal
        open={modal.open}
        customer={modal.customer}
        onClose={() => setModal({ open: false, customer: null })}
      />
    </>
  )
}

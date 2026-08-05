'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ExpenseCategoryFormModal } from './ExpenseCategoryFormModal'
import { DeleteExpenseCategoryButton } from './DeleteExpenseCategoryButton'
import type { ExpenseCategory } from '@/types/Expense'

export function ExpenseCategoriesTable({ categories }: { categories: ExpenseCategory[] }) {
  const [modal, setModal] = useState<{ open: boolean; category: ExpenseCategory | null }>({ open: false, category: null })

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-700">Expense Categories</h1>
        <Button onClick={() => setModal({ open: true, category: null })}>+ Add category</Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden mt-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Name', 'Description', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-xs font-600 text-muted-foreground px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-muted-foreground">No categories yet.</td></tr>
              ) : categories.map((c, i) => (
                <tr key={c.id} className={`hover:bg-muted/40 transition-colors ${i < categories.length - 1 ? 'border-b border-border' : ''}`}>
                  <td className="px-5 py-3.5 font-500">{c.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{c.description || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-mono text-[11px] font-500 px-2 py-0.5 rounded-full ${
                      c.is_active
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'
                    }`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Button variant="link" onClick={() => setModal({ open: true, category: c })}>Edit</Button>
                      <DeleteExpenseCategoryButton id={c.id} name={c.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ExpenseCategoryFormModal
        open={modal.open}
        category={modal.category}
        onClose={() => setModal({ open: false, category: null })}
      />
    </>
  )
}

'use client'

import { useState } from 'react'
import { formatMoney } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { ExpenseFormModal } from './ExpenseFormModal'
import { DeleteExpenseButton } from './DeleteExpenseButton'
import { ExpensesFilterBar, type ExpenseFilters } from './ExpensesFilterBar'
import type { Expense, ExpenseCategory } from '@/types/Expense'

export function ExpensesTable({ expenses, categories, currencySymbol, filters }: {
  expenses: Expense[]; categories: ExpenseCategory[]; currencySymbol: string; filters: ExpenseFilters
}) {
  const [modal, setModal] = useState<{ open: boolean; expense: Expense | null }>({ open: false, expense: null })

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-700">Expenses</h1>
        <Button onClick={() => setModal({ open: true, expense: null })}>+ Add expense</Button>
      </div>

      <div className="mt-4">
        <ExpensesFilterBar filters={filters} categories={categories} />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden mt-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Title', 'Category', 'Amount', 'Date', 'Note', ''].map(h => (
                  <th key={h} className="text-left text-xs font-600 text-muted-foreground px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">No expenses yet.</td></tr>
              ) : expenses.map((e, i) => (
                <tr key={e.id} className={`hover:bg-muted/40 transition-colors ${i < expenses.length - 1 ? 'border-b border-border' : ''}`}>
                  <td className="px-5 py-3.5 font-500">{e.title}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-[11px] font-500 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{e.category}</span>
                  </td>
                  <td className="px-5 py-3.5 font-mono font-600">{formatMoney(e.amount, currencySymbol)}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{e.expense_date}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs truncate max-w-[200px]">{e.note || '—'}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Button variant="link" onClick={() => setModal({ open: true, expense: e })}>Edit</Button>
                      <DeleteExpenseButton id={e.id} title={e.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ExpenseFormModal
        open={modal.open}
        expense={modal.expense}
        categories={categories}
        onClose={() => setModal({ open: false, expense: null })}
      />
    </>
  )
}

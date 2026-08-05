'use server'

import { revalidatePath } from 'next/cache'
import { expensesApi } from '@/lib/api/expenses'

export type ExpenseActionState = { error?: string } | undefined

function readExpensePayload(formData: FormData) {
  return {
    expense_category_id: Number(formData.get('expense_category_id')),
    title: String(formData.get('title') ?? ''),
    amount: Number(formData.get('amount')),
    expense_date: String(formData.get('expense_date') ?? ''),
    note: String(formData.get('note') ?? '') || undefined,
  }
}

export async function createExpenseAction(formData: FormData): Promise<ExpenseActionState> {
  const response = await expensesApi.create(readExpensePayload(formData))
  if (!response.success) {
    return { error: response.errors }
  }

  revalidatePath('/expenses')
}

export async function updateExpenseAction(id: number, formData: FormData): Promise<ExpenseActionState> {
  const response = await expensesApi.update(id, readExpensePayload(formData))
  if (!response.success) {
    return { error: response.errors }
  }

  revalidatePath('/expenses')
}

export async function deleteExpenseAction(id: number): Promise<ExpenseActionState> {
  const response = await expensesApi.remove(id)
  if (!response.success) {
    return { error: response.errors }
  }

  revalidatePath('/expenses')
}

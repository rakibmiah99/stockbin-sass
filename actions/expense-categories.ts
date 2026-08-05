'use server'

import { revalidatePath } from 'next/cache'
import { expenseCategoriesApi } from '@/lib/api/expense-categories'
import type { ExpenseCategory } from '@/types/Expense'

export type ExpenseCategoryActionState = { error?: string; category?: ExpenseCategory } | undefined

function revalidate() {
  revalidatePath('/expenses')
  revalidatePath('/expense-categories')
}

export async function createExpenseCategoryAction(formData: FormData): Promise<ExpenseCategoryActionState> {
  const response = await expenseCategoriesApi.create({
    name: String(formData.get('name') ?? ''),
    description: String(formData.get('description') ?? '') || undefined,
    is_active: formData.get('is_active') === 'on',
  })
  if (!response.success) {
    return { error: response.errors }
  }

  revalidate()
  return { category: response.data }
}

export async function updateExpenseCategoryAction(id: number, formData: FormData): Promise<ExpenseCategoryActionState> {
  const response = await expenseCategoriesApi.update(id, {
    name: String(formData.get('name') ?? ''),
    description: String(formData.get('description') ?? '') || undefined,
    is_active: formData.get('is_active') === 'on',
  })
  if (!response.success) {
    return { error: response.errors }
  }

  revalidate()
  return { category: response.data }
}

export async function deleteExpenseCategoryAction(id: number): Promise<ExpenseCategoryActionState> {
  const response = await expenseCategoriesApi.remove(id)
  if (!response.success) {
    return { error: response.errors }
  }

  revalidate()
}

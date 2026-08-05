'use server'

import { revalidatePath } from 'next/cache'
import { categoriesApi } from '@/lib/api/categories'

export type CategoryActionState = { error?: string } | undefined

function stripEmptyFile(formData: FormData, key: string) {
  const value = formData.get(key)
  if (value instanceof File && value.size === 0) {
    formData.delete(key)
  }
}

export async function createCategoryAction(formData: FormData): Promise<CategoryActionState> {
  stripEmptyFile(formData, 'image')
  const response = await categoriesApi.create(formData)
  if (!response.success) {
    return { error: response.errors }
  }
  revalidatePath('/categories')
}

export async function updateCategoryAction(id: number, formData: FormData): Promise<CategoryActionState> {
  stripEmptyFile(formData, 'image')
  const response = await categoriesApi.update(id, formData)
  if (!response.success) {
    return { error: response.errors }
  }
  revalidatePath('/categories')
}

export async function deleteCategoryAction(id: number): Promise<CategoryActionState> {
  const response = await categoriesApi.remove(id)
  if (!response.success) {
    return { error: response.errors }
  }
  revalidatePath('/categories')
}

export async function sortCategoriesAction(order: number[]): Promise<CategoryActionState> {
  const response = await categoriesApi.sort(order)
  if (!response.success) {
    return { error: response.errors }
  }
  revalidatePath('/categories')
}

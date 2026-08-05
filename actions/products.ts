'use server'

import { revalidatePath } from 'next/cache'
import { productsApi } from '@/lib/api/products'

export type ProductActionState = { error?: string } | undefined

function stripEmptyFile(formData: FormData, key: string) {
  const value = formData.get(key)
  if (value instanceof File && value.size === 0) {
    formData.delete(key)
  }
}

export async function createProductAction(formData: FormData): Promise<ProductActionState> {
  stripEmptyFile(formData, 'product_image')
  const response = await productsApi.create(formData)
  if (!response.success) {
    return { error: response.errors }
  }
  revalidatePath('/products')
}

export async function updateProductAction(id: number, formData: FormData): Promise<ProductActionState> {
  stripEmptyFile(formData, 'product_image')
  const response = await productsApi.update(id, formData)
  if (!response.success) {
    return { error: response.errors }
  }
  revalidatePath('/products')
}

export async function deleteProductAction(id: number): Promise<ProductActionState> {
  const response = await productsApi.remove(id)
  if (!response.success) {
    return { error: response.errors }
  }
  revalidatePath('/products')
}

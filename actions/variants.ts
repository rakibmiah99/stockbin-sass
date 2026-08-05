'use server'

import { revalidatePath } from 'next/cache'
import { colorsApi } from '@/lib/api/colors'
import { sizesApi } from '@/lib/api/sizes'
import { weightsApi } from '@/lib/api/weights'
import { productUnitsApi } from '@/lib/api/product-units'
import type { SimpleCrudApi } from '@/lib/api/simple-crud'

export type VariantActionState = { error?: string } | undefined

async function create(api: SimpleCrudApi<unknown>, formData: FormData): Promise<VariantActionState> {
  const response = await api.create(String(formData.get('name') ?? ''))
  if (!response.success) {
    return { error: response.errors }
  }
  revalidatePath('/settings')
}

async function update(api: SimpleCrudApi<unknown>, id: number, formData: FormData): Promise<VariantActionState> {
  const response = await api.update(id, String(formData.get('name') ?? ''))
  if (!response.success) {
    return { error: response.errors }
  }
  revalidatePath('/settings')
}

async function remove(api: SimpleCrudApi<unknown>, id: number): Promise<VariantActionState> {
  const response = await api.remove(id)
  if (!response.success) {
    return { error: response.errors }
  }
  revalidatePath('/settings')
}

export async function createColorAction(formData: FormData) { return create(colorsApi, formData) }
export async function updateColorAction(id: number, formData: FormData) { return update(colorsApi, id, formData) }
export async function deleteColorAction(id: number) { return remove(colorsApi, id) }

export async function createSizeAction(formData: FormData) { return create(sizesApi, formData) }
export async function updateSizeAction(id: number, formData: FormData) { return update(sizesApi, id, formData) }
export async function deleteSizeAction(id: number) { return remove(sizesApi, id) }

export async function createWeightAction(formData: FormData) { return create(weightsApi, formData) }
export async function updateWeightAction(id: number, formData: FormData) { return update(weightsApi, id, formData) }
export async function deleteWeightAction(id: number) { return remove(weightsApi, id) }

export async function createProductUnitAction(formData: FormData) { return create(productUnitsApi, formData) }
export async function updateProductUnitAction(id: number, formData: FormData) { return update(productUnitsApi, id, formData) }
export async function deleteProductUnitAction(id: number) { return remove(productUnitsApi, id) }

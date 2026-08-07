'use server'

import { revalidatePath } from 'next/cache'
import { productStocksApi } from '@/lib/api/product-stocks'

export type StockActionState = { error?: string } | undefined

export async function createStockAction(formData: FormData): Promise<StockActionState> {
  const response = await productStocksApi.create({
    product_id: Number(formData.get('product_id')),
    purchase_unit_cost: Number(formData.get('purchase_unit_cost')),
    qty: Number(formData.get('qty')),
    stock_date: String(formData.get('stock_date') ?? ''),
  })
  if (!response.success) {
    return { error: response.errors }
  }

  revalidatePath('/stocks')
  revalidatePath('/stocks/history')
  revalidatePath('/products')
}

export async function updateStockAction(id: number, formData: FormData): Promise<StockActionState> {
  const response = await productStocksApi.update(id, {
    purchase_unit_cost: Number(formData.get('purchase_unit_cost')),
    qty: Number(formData.get('qty')),
    stock_date: String(formData.get('stock_date') ?? ''),
  })
  if (!response.success) {
    return { error: response.errors }
  }

  revalidatePath('/stocks')
  revalidatePath('/stocks/history')
}

export async function deleteStockAction(id: number): Promise<StockActionState> {
  const response = await productStocksApi.remove(id)
  if (!response.success) {
    return { error: response.errors }
  }

  revalidatePath('/stocks')
  revalidatePath('/stocks/history')
}

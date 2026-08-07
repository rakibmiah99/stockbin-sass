'use server'

import { revalidatePath } from 'next/cache'
import { saleInvoicesApi } from '@/lib/api/sale-invoices'
import { saleReturnsApi, saleWastagesApi } from '@/lib/api/sale-returns'

export async function searchInvoicesAction(search: string) {
  const response = await saleInvoicesApi.list({ search })
  if (!response.success) {
    return { error: response.errors }
  }
  return { invoices: response.data }
}

export async function getInvoiceAction(id: number) {
  const response = await saleInvoicesApi.get(id)
  if (!response.success) {
    return { error: response.errors }
  }
  return { invoice: response.data }
}

export type CreateReturnActionState = { error?: string } | undefined

export async function createReturnAction(payload: {
  invoiceId: number
  return_date: string
  reason?: string
  note?: string
  items: { sale_invoice_item_id: number; returned_qty: number; restocked_qty: number; wastage_qty: number; reason?: string }[]
}): Promise<CreateReturnActionState> {
  const { invoiceId, ...body } = payload
  const response = await saleReturnsApi.create(invoiceId, body)
  if (!response.success) {
    return { error: response.errors }
  }

  revalidatePath('/returns')
  revalidatePath('/wastage')
  revalidatePath('/stocks')
  revalidatePath('/stocks/history')
}

export async function getSaleReturnAction(id: number) {
  const response = await saleReturnsApi.get(id)
  if (!response.success) {
    return { error: response.errors }
  }
  return { data: response.data }
}

export async function getSaleWastageAction(id: number) {
  const response = await saleWastagesApi.get(id)
  if (!response.success) {
    return { error: response.errors }
  }
  return { data: response.data }
}

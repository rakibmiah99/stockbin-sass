'use server'

import { revalidatePath } from 'next/cache'
import { customersApi } from '@/lib/api/customers'

export type CustomerActionState = { error?: string } | undefined

export async function createCustomerAction(formData: FormData): Promise<CustomerActionState> {
  const customer_name = String(formData.get('customer_name') ?? '')
  const customer_phone = String(formData.get('customer_phone') ?? '')

  const response = await customersApi.create({ customer_name, customer_phone })
  if (!response.success) {
    return { error: response.errors }
  }

  revalidatePath('/customers')
}

export async function updateCustomerAction(id: number, formData: FormData): Promise<CustomerActionState> {
  const customer_name = String(formData.get('customer_name') ?? '')
  const customer_phone = String(formData.get('customer_phone') ?? '')

  const response = await customersApi.update(id, { customer_name, customer_phone })
  if (!response.success) {
    return { error: response.errors }
  }

  revalidatePath('/customers')
}

export async function deleteCustomerAction(id: number): Promise<CustomerActionState> {
  const response = await customersApi.remove(id)
  if (!response.success) {
    return { error: response.errors }
  }

  revalidatePath('/customers')
}

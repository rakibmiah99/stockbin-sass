import { apiFetch } from './client'
import type { SaleInvoiceListItem, SaleInvoiceDetail } from '@/types/SaleInvoice'

export const saleInvoicesApi = {
  list(params: { search?: string } = {}) {
    const query = new URLSearchParams()
    if (params.search) query.set('search', params.search)
    const qs = query.toString()

    return apiFetch<SaleInvoiceListItem[]>(`/api/sale-invoices${qs ? `?${qs}` : ''}`)
  },

  get(id: number) {
    return apiFetch<SaleInvoiceDetail>(`/api/sale-invoices/${id}`)
  },
}

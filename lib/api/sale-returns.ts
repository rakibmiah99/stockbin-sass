import { apiFetch } from './client'
import type { SaleReturn, ReturnListPeriod } from '@/types/SaleReturn'

type ListParams = {
  period?: ReturnListPeriod
  from_date?: string
  to_date?: string
  search?: string
}

function buildListQuery(params: ListParams) {
  const query = new URLSearchParams()
  if (params.search) query.set('search', params.search)
  if (params.period) query.set('period', params.period)
  if (params.from_date) query.set('from_date', params.from_date)
  if (params.to_date) query.set('to_date', params.to_date)
  return query.toString()
}

type CreateReturnPayload = {
  return_date: string
  reason?: string
  note?: string
  items: {
    sale_invoice_item_id: number
    returned_qty: number
    restocked_qty: number
    wastage_qty: number
    reason?: string
  }[]
}

// Both restock-only (Sale Returns) and wastage-only (Sale Wastages) rows come
// from the same underlying resource — the backend classifies a created row
// by which quantities it was given, so one `create` here covers both menus.
export const saleReturnsApi = {
  list(params: ListParams = {}) {
    const qs = buildListQuery(params)
    return apiFetch<SaleReturn[]>(`/api/sale-returns${qs ? `?${qs}` : ''}`)
  },

  get(id: number) {
    return apiFetch<SaleReturn>(`/api/sale-returns/${id}`)
  },

  create(saleInvoiceId: number, payload: CreateReturnPayload) {
    return apiFetch<SaleReturn>(`/api/sale-invoices/${saleInvoiceId}/returns`, { method: 'POST', body: payload })
  },
}

export const saleWastagesApi = {
  list(params: ListParams = {}) {
    const qs = buildListQuery(params)
    return apiFetch<SaleReturn[]>(`/api/sale-wastages${qs ? `?${qs}` : ''}`)
  },

  get(id: number) {
    return apiFetch<SaleReturn>(`/api/sale-wastages/${id}`)
  },
}

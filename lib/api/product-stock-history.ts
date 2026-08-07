import { apiFetch } from './client'
import type { ProductStock, StockHistoryPeriod } from '@/types/Stock'

type StockHistoryParams = {
  product_id: number | string
  period?: StockHistoryPeriod
  from_date?: string
  to_date?: string
}

export const productStockHistoryApi = {
  list({ product_id, period, from_date, to_date }: StockHistoryParams) {
    const query = new URLSearchParams()
    query.set('product_id', String(product_id))
    if (period) query.set('period', period)
    if (from_date) query.set('from_date', from_date)
    if (to_date) query.set('to_date', to_date)

    return apiFetch<ProductStock[]>(`/api/product-stock-history?${query.toString()}`)
  },
}

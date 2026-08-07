import { apiFetch } from './client'
import type { ProductStock, ProductStockSummary } from '@/types/Stock'

type ProductStockPayload = {
  product_id: number
  purchase_unit_cost: number
  qty: number
  stock_date: string
}

export const productStocksApi = {
  list() {
    return apiFetch<ProductStockSummary[]>('/api/product-stocks')
  },

  create(payload: ProductStockPayload) {
    return apiFetch<ProductStock>('/api/product-stocks', { method: 'POST', body: payload })
  },

  update(id: number, payload: Omit<ProductStockPayload, 'product_id'>) {
    return apiFetch<ProductStock>(`/api/product-stocks/${id}`, { method: 'PUT', body: payload })
  },

  remove(id: number) {
    return apiFetch<null>(`/api/product-stocks/${id}`, { method: 'DELETE' })
  },
}

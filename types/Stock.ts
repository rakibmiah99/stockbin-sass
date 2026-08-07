export type ProductStockSummary = {
  product_id: number
  category_id: number
  category_name: string
  product_code: string
  product_name: string
  product_image: string | null
  unit: string | null
  color: string | null
  size: string | null
  weight: string | null
  price: string
  total_qty: number
  remaining_qty: number
  stock_alert: boolean
}

export type ProductStockProduct = {
  id: number
  category_id: number
  category_name: string
  product_code: string
  product_name: string
  product_image: string | null
  unit: string | null
  color: string | null
  size: string | null
  weight: string | null
  price: string
}

export type ProductStock = {
  id: number
  tenant_id: number
  product_id: number
  purchase_unit_cost: string
  qty: number
  remaining_qty: number
  stock_date: string
  stock_alert: boolean
  is_used: boolean
  product: ProductStockProduct
}

export type StockHistoryPeriod = 'last_100_records' | 'last_30_days' | 'last_60_days' | 'last_90_days' | 'custom'

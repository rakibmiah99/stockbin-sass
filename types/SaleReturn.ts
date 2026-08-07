export type SaleReturnInvoiceSummary = {
  id: number
  invoice_no: string
  invoice_status: string
  due_amount: string
  return_amount: string
  payment_status: string
}

export type SaleReturnCustomer = {
  id: number
  customer_name: string
  customer_phone: string
}

export type SaleReturnItemProduct = {
  id: number
  product_code: string
  product_name: string
  category_name: string
  product_image: string | null
  unit: string | null
  color: string | null
  size: string | null
  weight: string | null
}

export type SaleReturnItem = {
  id: number
  sale_invoice_item_id: number
  sale_invoice_item_stock_layer_id: number
  product_id: number
  returned_qty: number
  restocked_qty: number
  wastage_qty: number
  return_credit_amount: string
  reason: string | null
  product: SaleReturnItemProduct
}

export type SaleReturn = {
  id: number
  tenant_id: number
  invoice_id: number
  return_no: string
  return_date: string
  total_returned_qty: number
  total_restocked_qty: number
  total_wastage_qty: number
  return_value: string
  due_adjustment: string
  refund_amount: string
  total_refund_amount?: string
  reason: string | null
  note: string | null
  created_by: string | null
  updated_by: string | null
  invoice: SaleReturnInvoiceSummary
  customer: SaleReturnCustomer
  items?: SaleReturnItem[]
  companion_returns?: SaleReturn[]
}

export type ReturnListPeriod = 'last_100_records' | 'last_30_days' | 'last_60_days' | 'last_90_days' | 'custom'

export type ReturnFilters = {
  period: ReturnListPeriod
  from_date: string
  to_date: string
  search: string
}

export type SaleInvoiceCustomer = {
  id: number
  customer_name: string
  customer_phone: string
}

export type SaleInvoiceProduct = {
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

export type SaleInvoiceItem = {
  id: number
  product_id: number
  sold_qty: number
  sale_unit_price: string
  sale_discount_amount: string
  sale_line_total: string
  purchase_cost_total: string
  returned_qty: number
  restocked_qty: number
  wastage_qty: number
  product: SaleInvoiceProduct
}

export type SaleInvoiceListItem = {
  id: number
  tenant_id: number
  invoice_no: string
  customer_id: number
  invoice_date: string
  sub_total: string
  invoice_discount_amount: string
  vat_rate: string
  vat_amount: string
  grand_total: string
  paid_amount: string
  due_amount: string
  return_amount: string
  payment_status: string
  invoice_status: string
  total_restocked_qty: number
  total_wastage_qty: number
  customer: SaleInvoiceCustomer
}

export type SaleInvoiceDetail = SaleInvoiceListItem & {
  items: SaleInvoiceItem[]
}

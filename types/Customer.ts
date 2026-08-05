export type Customer = {
  id: number
  tenant_id: number
  customer_name: string
  customer_phone: string
  total_sale: string
  total_paid: string
  total_due: string
  created_by: string | null
  updated_by: string | null
}

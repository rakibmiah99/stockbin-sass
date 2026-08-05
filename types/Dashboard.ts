export type DashboardPeriod = 'today' | 'last_7_days' | 'last_30_days' | 'last_60_days' | 'last_90_days'

export type DashboardMetric = {
  value: string
  trend_percent: number | null
  chart: number[] | null
}

export type DashboardDue = {
  value: string
  customer_count: number
  chart: null
}

export type DashboardOverview = {
  period: DashboardPeriod
  from_date: string
  to_date: string
  sales: DashboardMetric
  profit: DashboardMetric
  due: DashboardDue
  expenses: DashboardMetric
  returns: DashboardMetric
  wastage: DashboardMetric
  vat_collected: DashboardMetric
  completed_orders: number
  draft_orders: number
  low_stock_count: number
}

export type DashboardListResponse<T> = {
  count: number
  items: T[]
}

export type LowStockItem = {
  product_id: number
  product_name: string
  product_code: string
  remaining_qty: number
  price: string
  unit: string
  stock_alert: boolean
}

export type PaymentStatus = 'paid' | 'partial' | 'due'

export type DashboardInvoice = {
  id: number
  invoice_no: string
  invoice_date: string
  grand_total: string
  due_amount: string
  payment_status: PaymentStatus
  customer_name: string
  customer_phone: string
}

export type DueCustomer = {
  id: number
  customer_name: string
  customer_phone: string
  total_due: string
}

export type DashboardExpense = {
  id: number
  title: string
  amount: string
  expense_date: string
  category: string
}

import { apiRequest } from "./client";

export type DashboardPeriod = "today" | "last_7_days" | "last_30_days" | "last_60_days" | "last_90_days";

export interface DashboardMetric {
  value: string;
  trend_percent: number | null;
  chart: number[] | null;
}

export interface DashboardDue {
  value: string;
  customer_count: number;
  chart: null;
}

export interface DashboardOverview {
  period: DashboardPeriod;
  from_date: string;
  to_date: string;
  sales: DashboardMetric;
  profit: DashboardMetric;
  due: DashboardDue;
  expenses: DashboardMetric;
  returns: DashboardMetric;
  vat_collected: DashboardMetric;
  completed_orders: number;
  draft_orders: number;
  low_stock_count: number;
}

export interface LowStockItem {
  product_id: number;
  product_name: string;
  product_code: string;
  remaining_qty: number;
  price: string;
  unit: string;
  stock_alert: boolean;
}

export interface DashboardInvoice {
  id: number;
  invoice_no: string;
  invoice_date: string;
  grand_total: string;
  due_amount: string;
  payment_status: string;
  customer_name: string;
  customer_phone: string;
}

export interface DueCustomer {
  id: number;
  customer_name: string;
  customer_phone: string;
  total_due: string;
}

export interface DashboardExpense {
  id: number;
  title: string;
  amount: string;
  expense_date: string;
  category: string;
}

export interface DashboardList<T> {
  count: number;
  items: T[];
}

export const dashboardApi = {
  overview: (period: DashboardPeriod, token: string) =>
    apiRequest<DashboardOverview>(`/dashboard?period=${period}`, { token }),

  lowStock: (token: string) =>
    apiRequest<DashboardList<LowStockItem>>("/dashboard/low-stock", { token }),

  invoices: (token: string) =>
    apiRequest<DashboardList<DashboardInvoice>>("/dashboard/invoices", { token }),

  dueCustomers: (token: string) =>
    apiRequest<DashboardList<DueCustomer>>("/dashboard/due-customers", { token }),

  expenses: (token: string) =>
    apiRequest<DashboardList<DashboardExpense>>("/dashboard/expenses", { token }),
};

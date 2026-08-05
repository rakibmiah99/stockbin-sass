import { apiFetch } from './client'
import type {
  DashboardOverview,
  DashboardPeriod,
  DashboardListResponse,
  LowStockItem,
  DashboardInvoice,
  DueCustomer,
  DashboardExpense,
} from '@/types/Dashboard'

export const dashboardApi = {
  overview(period: DashboardPeriod = 'last_7_days') {
    return apiFetch<DashboardOverview>(`/api/dashboard?period=${period}`)
  },

  lowStock() {
    return apiFetch<DashboardListResponse<LowStockItem>>('/api/dashboard/low-stock')
  },

  invoices() {
    return apiFetch<DashboardListResponse<DashboardInvoice>>('/api/dashboard/invoices')
  },

  dueCustomers() {
    return apiFetch<DashboardListResponse<DueCustomer>>('/api/dashboard/due-customers')
  },

  expenses() {
    return apiFetch<DashboardListResponse<DashboardExpense>>('/api/dashboard/expenses')
  },
}

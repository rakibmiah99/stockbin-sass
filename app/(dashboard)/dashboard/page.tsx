import { dashboardApi } from '@/lib/api/dashboard'
import { settingsApi } from '@/lib/api/settings'
import { StatCard } from '@/components/ui/StatCard'
import { PeriodSelect } from '@/components/dashboard/PeriodSelect'
import { OverviewChart } from '@/components/dashboard/OverviewChart'
import { RecentInvoicesTable } from '@/components/dashboard/RecentInvoicesTable'
import { DueCustomersList } from '@/components/dashboard/DueCustomersList'
import { LowStockList } from '@/components/dashboard/LowStockList'
import { RecentExpensesList } from '@/components/dashboard/RecentExpensesList'
import { formatMoney } from '@/lib/format'
import type { DashboardPeriod } from '@/types/Dashboard'

function trendLabel(trend: number | null) {
  if (trend === null) return 'No change vs last period'
  const arrow = trend >= 0 ? '↑' : '↓'
  return `${arrow} ${Math.abs(trend).toFixed(1)}% vs last period`
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const { period: periodParam } = await searchParams
  const period = (periodParam as DashboardPeriod) || 'last_7_days'

  const [overviewRes, lowStockRes, invoicesRes, dueCustomersRes, expensesRes, settingsRes] = await Promise.all([
    dashboardApi.overview(period),
    dashboardApi.lowStock(),
    dashboardApi.invoices(),
    dashboardApi.dueCustomers(),
    dashboardApi.expenses(),
    settingsApi.getBusinessSettings(),
  ])

  if (!overviewRes.success || !overviewRes.data) {
    return (
      <div className="p-6">
        <div className="bg-card border border-border rounded-xl p-8 text-center text-sm text-muted-foreground">
          {overviewRes.errors || 'Could not load dashboard data.'}
        </div>
      </div>
    )
  }

  const overview = overviewRes.data
  const currencySymbol = settingsRes.data?.currency_symbol ?? '৳'

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-700 text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{overview.from_date} – {overview.to_date}</p>
        </div>
        <PeriodSelect period={period} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Sales" value={formatMoney(overview.sales.value, currencySymbol)} sub={trendLabel(overview.sales.trend_percent)} icon="💰" accent="text-emerald-600 dark:text-emerald-400" />
        <StatCard label="Profit" value={formatMoney(overview.profit.value, currencySymbol)} sub={trendLabel(overview.profit.trend_percent)} icon="📈" accent="text-blue-600 dark:text-blue-400" />
        <StatCard label="Due" value={formatMoney(overview.due.value, currencySymbol)} sub={`${overview.due.customer_count} customers`} icon="⏳" accent="text-rose-600 dark:text-rose-400" />
        <StatCard label="Expenses" value={formatMoney(overview.expenses.value, currencySymbol)} sub={trendLabel(overview.expenses.trend_percent)} icon="🧾" accent="text-amber-600 dark:text-amber-400" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Returns" value={formatMoney(overview.returns.value, currencySymbol)} sub={trendLabel(overview.returns.trend_percent)} icon="↩️" accent="text-violet-600 dark:text-violet-400" />
        <StatCard label="Wastage" value={formatMoney(overview.wastage.value, currencySymbol)} sub={trendLabel(overview.wastage.trend_percent)} icon="🗑" accent="text-orange-600 dark:text-orange-400" />
        <StatCard label="VAT collected" value={formatMoney(overview.vat_collected.value, currencySymbol)} sub={trendLabel(overview.vat_collected.trend_percent)} icon="🏛" accent="text-primary" />
        <StatCard label="Orders" value={`${overview.completed_orders}`} sub={`${overview.draft_orders} drafts`} icon="📦" accent="text-blue-600 dark:text-blue-400" />
        <StatCard label="Low stock" value={`${overview.low_stock_count}`} sub="products below threshold" icon="⚠️" accent="text-rose-600 dark:text-rose-400" />
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-600 text-foreground text-sm mb-1">Sales, profit &amp; expenses</h3>
        <p className="text-xs text-muted-foreground mb-3">Daily breakdown for the selected period</p>
        <OverviewChart overview={overview} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentInvoicesTable invoices={invoicesRes.data?.items ?? []} currencySymbol={currencySymbol} />
        </div>
        <DueCustomersList customers={dueCustomersRes.data?.items ?? []} currencySymbol={currencySymbol} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LowStockList items={lowStockRes.data?.items ?? []} />
        <RecentExpensesList expenses={expensesRes.data?.items ?? []} currencySymbol={currencySymbol} />
      </div>
    </div>
  )
}

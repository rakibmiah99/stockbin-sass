"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CreditCard,
  PackageCheck,
  Percent,
  Receipt,
  TrendingUp,
  Undo2,
  Users,
  Wallet,
} from "lucide-react";
import {
  dashboardApi,
  type DashboardExpense,
  type DashboardInvoice,
  type DashboardOverview,
  type DashboardPeriod,
  type DueCustomer,
  type LowStockItem,
} from "@/lib/api/dashboard";
import { shopSettingsApi } from "@/lib/api/shopSettings";
import { formatMoney } from "@/lib/format";
import { StatCard } from "@/components/dashboard/StatCard";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { StatsSkeleton, ListsSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { LowStockList } from "@/components/dashboard/LowStockList";
import { RecentInvoicesList } from "@/components/dashboard/RecentInvoicesList";
import { DueCustomersList } from "@/components/dashboard/DueCustomersList";
import { RecentExpensesList } from "@/components/dashboard/RecentExpensesList";
import { FormError } from "@/components/ui/FormError";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const [period, setPeriod] = useState<DashboardPeriod>("last_7_days");
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [overviewError, setOverviewError] = useState<string | null>(null);

  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [invoices, setInvoices] = useState<DashboardInvoice[]>([]);
  const [invoicesCount, setInvoicesCount] = useState(0);
  const [dueCustomers, setDueCustomers] = useState<DueCustomer[]>([]);
  const [dueCustomersCount, setDueCustomersCount] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState<DashboardExpense[]>([]);
  const [recentExpensesCount, setRecentExpensesCount] = useState(0);
  const [listsError, setListsError] = useState<string | null>(null);
  const [listsLoaded, setListsLoaded] = useState(false);

  const [currencySymbol, setCurrencySymbol] = useState("৳");

  const loadOverview = useCallback(async (selectedPeriod: DashboardPeriod) => {
    setOverviewError(null);
    try {
      const data = await dashboardApi.overview(selectedPeriod);
      setOverview(data);
    } catch (err) {
      setOverviewError(err instanceof Error ? err.message : "Couldn't load dashboard data.");
    }
  }, []);

  const loadLists = useCallback(async () => {
    setListsError(null);
    try {
      const [low, inv, due, exp, shop] = await Promise.all([
        dashboardApi.lowStock(),
        dashboardApi.invoices(),
        dashboardApi.dueCustomers(),
        dashboardApi.expenses(),
        shopSettingsApi.get().catch(() => null),
      ]);
      setLowStock(low.items);
      setLowStockCount(low.count);
      setInvoices(inv.items);
      setInvoicesCount(inv.count);
      setDueCustomers(due.items);
      setDueCustomersCount(due.count);
      setRecentExpenses(exp.items);
      setRecentExpensesCount(exp.count);
      if (shop?.currency_symbol) setCurrencySymbol(shop.currency_symbol);
    } catch (err) {
      setListsError(err instanceof Error ? err.message : "Couldn't load dashboard lists.");
    } finally {
      setListsLoaded(true);
    }
  }, []);

  useEffect(() => {
    async function run() {
      await loadOverview(period);
    }
    void run();
  }, [period, loadOverview]);

  useEffect(() => {
    async function run() {
      await loadLists();
    }
    void run();
  }, [loadLists]);

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-col gap-base sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body text-muted">
          {overview ? `${overview.from_date} – ${overview.to_date}` : "Business overview"}
        </p>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {overviewError ? (
        <div className="flex flex-col items-start gap-base">
          <FormError message={overviewError} />
          <Button variant="outline" size="sm" onClick={() => void loadOverview(period)}>
            Retry
          </Button>
        </div>
      ) : !overview ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={TrendingUp}
            label="Sales"
            value={formatMoney(overview.sales.value, currencySymbol)}
            trendPercent={overview.sales.trend_percent}
            tone="primary"
          />
          <StatCard
            icon={Wallet}
            label="Profit"
            value={formatMoney(overview.profit.value, currencySymbol)}
            trendPercent={overview.profit.trend_percent}
            tone="success"
          />
          <StatCard
            icon={Receipt}
            label="Due"
            value={formatMoney(overview.due.value, currencySymbol)}
            helpText={`${overview.due.customer_count} customer${overview.due.customer_count === 1 ? "" : "s"}`}
            tone="warning"
          />
          <StatCard
            icon={CreditCard}
            label="Expenses"
            value={formatMoney(overview.expenses.value, currencySymbol)}
            trendPercent={overview.expenses.trend_percent}
            tone="neutral"
          />
          <StatCard
            icon={Undo2}
            label="Returns"
            value={formatMoney(overview.returns.value, currencySymbol)}
            trendPercent={overview.returns.trend_percent}
            tone="warning"
          />
          <StatCard
            icon={Percent}
            label="VAT collected"
            value={formatMoney(overview.vat_collected.value, currencySymbol)}
            trendPercent={overview.vat_collected.trend_percent}
            tone="info"
          />
          <StatCard
            icon={PackageCheck}
            label="Orders"
            value={String(overview.completed_orders)}
            helpText={`${overview.draft_orders} draft`}
            tone="primary"
          />
          <StatCard
            icon={AlertTriangle}
            label="Low stock"
            value={String(overview.low_stock_count)}
            helpText="products at or below threshold"
            tone="danger"
          />
        </div>
      )}

      {listsError ? (
        <div className="flex flex-col items-start gap-base">
          <FormError message={listsError} />
          <Button variant="outline" size="sm" onClick={() => void loadLists()}>
            Retry
          </Button>
        </div>
      ) : !listsLoaded ? (
        <ListsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-lg lg:grid-cols-2">
          <SectionCard icon={AlertTriangle} title="Low stock" count={lowStockCount}>
            <LowStockList items={lowStock} currencySymbol={currencySymbol} />
          </SectionCard>
          <SectionCard icon={Receipt} title="Recent invoices" count={invoicesCount}>
            <RecentInvoicesList items={invoices} currencySymbol={currencySymbol} />
          </SectionCard>
          <SectionCard icon={Users} title="Due customers" count={dueCustomersCount}>
            <DueCustomersList items={dueCustomers} currencySymbol={currencySymbol} />
          </SectionCard>
          <SectionCard icon={Wallet} title="Recent expenses" count={recentExpensesCount}>
            <RecentExpensesList items={recentExpenses} currencySymbol={currencySymbol} />
          </SectionCard>
        </div>
      )}
    </div>
  );
}

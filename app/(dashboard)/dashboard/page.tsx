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
import { redirect } from "next/navigation";
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
import { ApiError } from "@/lib/api/client";
import { clearAuthToken, getAuthToken } from "@/lib/auth/cookies";
import { formatMoney } from "@/lib/format";
import { StatCard } from "@/components/dashboard/StatCard";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { LowStockList } from "@/components/dashboard/LowStockList";
import { RecentInvoicesList } from "@/components/dashboard/RecentInvoicesList";
import { DueCustomersList } from "@/components/dashboard/DueCustomersList";
import { RecentExpensesList } from "@/components/dashboard/RecentExpensesList";
import { FormError } from "@/components/ui/FormError";

const VALID_PERIODS: DashboardPeriod[] = [
  "today",
  "last_7_days",
  "last_30_days",
  "last_60_days",
  "last_90_days",
];

function parsePeriod(value: string | undefined): DashboardPeriod {
  return VALID_PERIODS.includes(value as DashboardPeriod) ? (value as DashboardPeriod) : "last_7_days";
}

interface DashboardData {
  overview: DashboardOverview;
  lowStock: { count: number; items: LowStockItem[] };
  invoices: { count: number; items: DashboardInvoice[] };
  dueCustomers: { count: number; items: DueCustomer[] };
  expenses: { count: number; items: DashboardExpense[] };
  currencySymbol: string;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: rawPeriod } = await searchParams;
  const period = parsePeriod(rawPeriod);

  const token = await getAuthToken();
  if (!token) redirect("/login");

  let data: DashboardData | null = null;
  let errorMessage: string | null = null;

  try {
    const [overview, lowStock, invoices, dueCustomers, expenses, shopSettings] = await Promise.all([
      dashboardApi.overview(period, token),
      dashboardApi.lowStock(token),
      dashboardApi.invoices(token),
      dashboardApi.dueCustomers(token),
      dashboardApi.expenses(token),
      shopSettingsApi.get(token).catch(() => null),
    ]);

    data = {
      overview,
      lowStock,
      invoices,
      dueCustomers,
      expenses,
      currencySymbol: shopSettings?.currency_symbol ?? "৳",
    };
  } catch (err) {
    if (err instanceof ApiError && err.message === "Unauthenticated.") {
      await clearAuthToken();
      redirect("/login");
    }
    errorMessage = err instanceof ApiError ? err.message : "Couldn't load dashboard data.";
  }

  if (errorMessage || !data) {
    return (
      <div className="flex flex-col items-start gap-base">
        <FormError message={errorMessage} />
        <a
          href="/dashboard"
          className="rounded-md border border-border bg-surface px-base py-sm text-small font-medium text-foreground transition-colors duration-[var(--motion-duration-fast)] hover:bg-surface-secondary"
        >
          Retry
        </a>
      </div>
    );
  }

  const { overview, lowStock, invoices, dueCustomers, expenses, currencySymbol } = data;

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-col gap-base sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body text-muted">
          {overview.from_date} – {overview.to_date}
        </p>
        <PeriodSelector value={period} />
      </div>

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

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-2">
        <SectionCard icon={AlertTriangle} title="Low stock" count={lowStock.count}>
          <LowStockList items={lowStock.items} currencySymbol={currencySymbol} />
        </SectionCard>
        <SectionCard icon={Receipt} title="Recent invoices" count={invoices.count}>
          <RecentInvoicesList items={invoices.items} currencySymbol={currencySymbol} />
        </SectionCard>
        <SectionCard icon={Users} title="Due customers" count={dueCustomers.count}>
          <DueCustomersList items={dueCustomers.items} currencySymbol={currencySymbol} />
        </SectionCard>
        <SectionCard icon={Wallet} title="Recent expenses" count={expenses.count}>
          <RecentExpensesList items={expenses.items} currencySymbol={currencySymbol} />
        </SectionCard>
      </div>
    </div>
  );
}

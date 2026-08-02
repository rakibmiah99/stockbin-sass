import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { expensesApi, type ExpensePeriod } from "@/lib/api/expenses";
import { expenseCategoriesApi } from "@/lib/api/expenseCategories";
import { shopSettingsApi } from "@/lib/api/shopSettings";
import { ApiError } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/cookies";
import { formatMoney, formatDate } from "@/lib/format";
import { DeleteExpenseButton } from "@/components/expenses/DeleteExpenseButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Expenses",
};

const PERIODS: { value: ExpensePeriod; label: string }[] = [
  { value: "last_100_records", label: "Latest 100" },
  { value: "last_30_days", label: "30 days" },
  { value: "last_60_days", label: "60 days" },
  { value: "last_90_days", label: "90 days" },
  { value: "custom", label: "Custom range" },
];

function parsePeriod(value: string | undefined): ExpensePeriod {
  return PERIODS.some((p) => p.value === value) ? (value as ExpensePeriod) : "last_100_records";
}

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{
    period?: string;
    from_date?: string;
    to_date?: string;
    category_id?: string;
    search?: string;
    error?: string;
  }>;
}) {
  const sp = await searchParams;

  const token = await getAuthToken();
  if (!token) redirect("/login");

  const period = parsePeriod(sp.period);
  const categoryId = sp.category_id ? Number(sp.category_id) : undefined;
  const search = sp.search?.trim() || undefined;

  let expenses: Awaited<ReturnType<typeof expensesApi.list>> = [];
  let categories: Awaited<ReturnType<typeof expenseCategoriesApi.list>> = [];
  let currencySymbol = "৳";
  let loadError: string | null = null;

  try {
    const [expenseList, categoryList, shopSettings] = await Promise.all([
      expensesApi.list(token, {
        period,
        from_date: sp.from_date,
        to_date: sp.to_date,
        expense_category_id: categoryId,
        search,
      }),
      expenseCategoriesApi.list(token),
      shopSettingsApi.get(token).catch(() => null),
    ]);
    expenses = expenseList;
    categories = categoryList;
    currencySymbol = shopSettings?.currency_symbol ?? "৳";
  } catch (err) {
    loadError = err instanceof ApiError ? err.message : "Couldn't load expenses.";
  }

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-col gap-base sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h4 font-semibold text-foreground">Expenses</h1>
          <p className="text-body text-muted">Track and manage shop expenses by category.</p>
        </div>
        <div className="flex items-center gap-sm">
          <Link href="/dashboard/expenses/categories">
            <Button variant="outline">Categories</Button>
          </Link>
          <Link href="/dashboard/expenses/new">
            <Button>
              <Plus className="size-4" />
              Add expense
            </Button>
          </Link>
        </div>
      </div>

      <FormError message={sp.error ?? null} />

      <form
        method="get"
        className="flex flex-col gap-base rounded-lg border border-border bg-surface p-lg sm:flex-row sm:flex-wrap sm:items-end"
      >
        <div className="min-w-[10rem] flex-1">
          <FormField id="search" label="Search">
            <Input id="search" name="search" defaultValue={sp.search ?? ""} placeholder="Title or note" />
          </FormField>
        </div>

        <div className="min-w-[10rem]">
          <FormField id="category_id" label="Category">
            <Select id="category_id" name="category_id" defaultValue={sp.category_id ?? ""}>
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="min-w-[10rem]">
          <FormField id="period" label="Period">
            <Select id="period" name="period" defaultValue={period}>
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="min-w-[8rem]">
          <FormField id="from_date" label="From">
            <Input id="from_date" name="from_date" type="date" defaultValue={sp.from_date ?? ""} />
          </FormField>
        </div>

        <div className="min-w-[8rem]">
          <FormField id="to_date" label="To">
            <Input id="to_date" name="to_date" type="date" defaultValue={sp.to_date ?? ""} />
          </FormField>
        </div>

        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>

      {loadError ? (
        <FormError message={loadError} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-body">
            <thead className="border-b border-divider text-small text-muted">
              <tr>
                <th className="px-lg py-sm font-medium">Date</th>
                <th className="px-lg py-sm font-medium">Title</th>
                <th className="px-lg py-sm font-medium">Category</th>
                <th className="px-lg py-sm font-medium">Amount</th>
                <th className="px-lg py-sm font-medium">Note</th>
                <th className="px-lg py-sm text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-divider last:border-0">
                  <td className="px-lg py-base text-muted">{formatDate(expense.expense_date)}</td>
                  <td className="px-lg py-base font-medium text-foreground">{expense.title}</td>
                  <td className="px-lg py-base text-muted">{expense.category}</td>
                  <td className="px-lg py-base text-foreground">{formatMoney(expense.amount, currencySymbol)}</td>
                  <td className="px-lg py-base text-muted">{expense.note ?? "—"}</td>
                  <td className="px-lg py-base">
                    <div className="flex items-center justify-end gap-sm">
                      <Link
                        href={{
                          pathname: `/dashboard/expenses/${expense.id}/edit`,
                          query: {
                            category_id: String(expense.expense_category_id),
                            title: expense.title,
                            amount: expense.amount,
                            date: expense.expense_date,
                            note: expense.note ?? "",
                          },
                        }}
                        className="rounded-md px-sm py-xs text-small font-medium text-primary hover:bg-surface-secondary"
                      >
                        Edit
                      </Link>
                      <DeleteExpenseButton expenseId={expense.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-lg py-xl text-center text-muted">
                    No expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

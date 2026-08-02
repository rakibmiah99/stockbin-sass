import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { expenseCategoriesApi } from "@/lib/api/expenseCategories";
import { getAuthToken } from "@/lib/auth/cookies";
import { updateExpenseAction } from "@/lib/actions/expenses";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Edit Expense",
};

export default async function EditExpensePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    category_id?: string;
    title?: string;
    amount?: string;
    date?: string;
    note?: string;
    error?: string;
  }>;
}) {
  const { id } = await params;
  const expenseId = Number(id);
  if (!Number.isFinite(expenseId)) notFound();

  const sp = await searchParams;
  // The API has no single-expense GET endpoint, so the expenses list page
  // passes the current field values through the edit link's query string.
  if (!sp.title || !sp.amount || !sp.date || !sp.category_id) {
    redirect("/dashboard/expenses");
  }

  const token = await getAuthToken();
  if (!token) redirect("/login");

  const categories = await expenseCategoriesApi.list(token).catch(() => []);

  const updateExpenseWithId = updateExpenseAction.bind(null, expenseId);

  return (
    <div className="mx-auto flex w-full flex-col gap-xl">
      <div className="flex flex-col gap-xs">
        <h1 className="text-h4 font-semibold text-foreground">Edit expense</h1>
        <p className="text-body text-muted">Update this expense record.</p>
      </div>

      <form
        action={updateExpenseWithId}
        className="flex flex-col gap-lg rounded-lg border border-border bg-surface p-lg"
      >
        <FormError message={sp.error ?? null} />

        <FormField id="expense_category_id" label="Category">
          <Select id="expense_category_id" name="expense_category_id" required defaultValue={sp.category_id}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField id="title" label="Title">
          <Input id="title" name="title" required defaultValue={sp.title} />
        </FormField>

        <FormField id="amount" label="Amount">
          <Input id="amount" name="amount" type="number" step="0.01" min="0" required defaultValue={sp.amount} />
        </FormField>

        <FormField id="expense_date" label="Date">
          <Input id="expense_date" name="expense_date" type="date" required defaultValue={sp.date} />
        </FormField>

        <FormField id="note" label="Note (optional)">
          <Input id="note" name="note" defaultValue={sp.note ?? ""} />
        </FormField>

        <div className="flex items-center gap-base">
          <Button type="submit">Save changes</Button>
          <Link href="/dashboard/expenses" className="text-small font-medium text-muted hover:text-foreground">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

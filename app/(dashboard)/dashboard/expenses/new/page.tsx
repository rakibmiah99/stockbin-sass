import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { expenseCategoriesApi } from "@/lib/api/expenseCategories";
import { getAuthToken } from "@/lib/auth/cookies";
import { createExpenseAction } from "@/lib/actions/expenses";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Add Expense",
};

export default async function NewExpensePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const token = await getAuthToken();
  if (!token) redirect("/login");

  const categories = await expenseCategoriesApi.list(token).catch(() => []);

  return (
    <div className="mx-auto flex w-full flex-col gap-xl">
      <div className="flex flex-col gap-xs">
        <h1 className="text-h4 font-semibold text-foreground">Add expense</h1>
        <p className="text-body text-muted">Record a new shop expense.</p>
      </div>

      <form
        action={createExpenseAction}
        className="flex flex-col gap-lg rounded-lg border border-border bg-surface p-lg"
      >
        <FormError message={error ?? null} />

        {categories.length === 0 ? (
          <p className="text-small text-muted">
            You need an expense category first.{" "}
            <Link href="/dashboard/expenses/categories" className="font-medium text-primary hover:opacity-80">
              Create one
            </Link>
            .
          </p>
        ) : (
          <FormField id="expense_category_id" label="Category">
            <Select id="expense_category_id" name="expense_category_id" required defaultValue="">
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormField>
        )}

        <FormField id="title" label="Title">
          <Input id="title" name="title" required placeholder="June Shop Rent" />
        </FormField>

        <FormField id="amount" label="Amount">
          <Input id="amount" name="amount" type="number" step="0.01" min="0" required placeholder="0.00" />
        </FormField>

        <FormField id="expense_date" label="Date">
          <Input id="expense_date" name="expense_date" type="date" required />
        </FormField>

        <FormField id="note" label="Note (optional)">
          <Input id="note" name="note" placeholder="Paid by bank" />
        </FormField>

        <div className="flex items-center gap-base">
          <Button type="submit" disabled={categories.length === 0}>
            Save expense
          </Button>
          <Link href="/dashboard/expenses" className="text-small font-medium text-muted hover:text-foreground">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

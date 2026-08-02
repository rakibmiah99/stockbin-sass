import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { expenseCategoriesApi } from "@/lib/api/expenseCategories";
import { ApiError } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/cookies";
import { createExpenseCategoryAction } from "@/lib/actions/expenseCategories";
import { DeleteExpenseCategoryButton } from "@/components/expenses/DeleteExpenseCategoryButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Expense Categories",
};

export default async function ExpenseCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const token = await getAuthToken();
  if (!token) redirect("/login");

  let categories: Awaited<ReturnType<typeof expenseCategoriesApi.list>> = [];
  let loadError: string | null = null;
  try {
    categories = await expenseCategoriesApi.list(token);
  } catch (err) {
    loadError = err instanceof ApiError ? err.message : "Couldn't load categories.";
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-xl">
      <div className="flex flex-col gap-base sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h4 font-semibold text-foreground">Expense categories</h1>
          <p className="text-body text-muted">Group expenses — rent, transport, utilities, and more.</p>
        </div>
        <Link href="/dashboard/expenses" className="text-small font-medium text-primary hover:opacity-80">
          Back to expenses
        </Link>
      </div>

      <FormError message={error ?? null} />

      <form
        action={createExpenseCategoryAction}
        className="flex flex-col gap-lg rounded-lg border border-border bg-surface p-lg"
      >
        <h2 className="text-h5 font-semibold text-foreground">Add category</h2>

        <FormField id="name" label="Name">
          <Input id="name" name="name" required placeholder="Office Rent" />
        </FormField>

        <FormField id="description" label="Description (optional)">
          <Input id="description" name="description" placeholder="Monthly office rent" />
        </FormField>

        <Checkbox id="is_active" name="is_active" label="Active" defaultChecked />

        <Button type="submit" className="self-start">
          Add category
        </Button>
      </form>

      {loadError ? (
        <FormError message={loadError} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-body">
            <thead className="border-b border-divider text-small text-muted">
              <tr>
                <th className="px-lg py-sm font-medium">Name</th>
                <th className="px-lg py-sm font-medium">Description</th>
                <th className="px-lg py-sm font-medium">Status</th>
                <th className="px-lg py-sm text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-divider last:border-0">
                  <td className="px-lg py-base font-medium text-foreground">{category.name}</td>
                  <td className="px-lg py-base text-muted">{category.description ?? "—"}</td>
                  <td className="px-lg py-base">
                    <span
                      className={cn(
                        "rounded-full px-sm py-xs text-caption font-medium",
                        category.is_active ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                      )}
                    >
                      {category.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-lg py-base">
                    <div className="flex items-center justify-end gap-sm">
                      <Link
                        href={`/dashboard/expenses/categories/${category.id}/edit`}
                        className="rounded-md px-sm py-xs text-small font-medium text-primary hover:bg-surface-secondary"
                      >
                        Edit
                      </Link>
                      <DeleteExpenseCategoryButton categoryId={category.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-lg py-xl text-center text-muted">
                    No categories yet.
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

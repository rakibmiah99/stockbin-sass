import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { expenseCategoriesApi } from "@/lib/api/expenseCategories";
import { getAuthToken } from "@/lib/auth/cookies";
import { updateExpenseCategoryAction } from "@/lib/actions/expenseCategories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Edit Expense Category",
};

export default async function EditExpenseCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const categoryId = Number(id);
  if (!Number.isFinite(categoryId)) notFound();

  const token = await getAuthToken();
  if (!token) redirect("/login");

  // The API has no single-category GET endpoint, so we fetch the (small) full
  // list and find the one being edited.
  const categories = await expenseCategoriesApi.list(token).catch(() => []);
  const category = categories.find((c) => c.id === categoryId);
  if (!category) notFound();

  const updateCategoryWithId = updateExpenseCategoryAction.bind(null, categoryId);

  return (
    <div className="mx-auto flex w-full flex-col gap-xl">
      <div className="flex flex-col gap-xs">
        <h1 className="text-h4 font-semibold text-foreground">Edit category</h1>
        <p className="text-body text-muted">Update the &quot;{category.name}&quot; expense category.</p>
      </div>

      <form
        action={updateCategoryWithId}
        className="flex flex-col gap-lg rounded-lg border border-border bg-surface p-lg"
      >
        <FormError message={error ?? null} />

        <FormField id="name" label="Name">
          <Input id="name" name="name" required defaultValue={category.name} />
        </FormField>

        <FormField id="description" label="Description (optional)">
          <Input id="description" name="description" defaultValue={category.description ?? ""} />
        </FormField>

        <Checkbox id="is_active" name="is_active" label="Active" defaultChecked={category.is_active} />

        <div className="flex items-center gap-base">
          <Button type="submit">Save changes</Button>
          <Link
            href="/dashboard/expenses/categories"
            className="text-small font-medium text-muted hover:text-foreground"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

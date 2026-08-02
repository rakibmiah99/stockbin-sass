"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { expenseCategoriesApi } from "@/lib/api/expenseCategories";
import { ApiError } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/cookies";

function messageOf(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

function errorRedirect(path: string, message: string): never {
  const params = new URLSearchParams({ error: message });
  redirect(`${path}?${params.toString()}`);
}

export async function createExpenseCategoryAction(formData: FormData): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const isActive = formData.get("is_active") === "on";

  if (!name) {
    errorRedirect("/dashboard/expenses/categories", "Category name is required.");
  }

  try {
    await expenseCategoriesApi.create(token, {
      name,
      description: description || null,
      is_active: isActive,
    });
  } catch (err) {
    errorRedirect("/dashboard/expenses/categories", messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/expenses/categories");
  revalidatePath("/dashboard/expenses");
  redirect("/dashboard/expenses/categories");
}

export async function updateExpenseCategoryAction(categoryId: number, formData: FormData): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const isActive = formData.get("is_active") === "on";
  const editPath = `/dashboard/expenses/categories/${categoryId}/edit`;

  if (!name) {
    errorRedirect(editPath, "Category name is required.");
  }

  try {
    await expenseCategoriesApi.update(token, categoryId, {
      name,
      description: description || null,
      is_active: isActive,
    });
  } catch (err) {
    errorRedirect(editPath, messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/expenses/categories");
  revalidatePath("/dashboard/expenses");
  redirect("/dashboard/expenses/categories");
}

export async function deleteExpenseCategoryAction(categoryId: number): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  try {
    await expenseCategoriesApi.remove(token, categoryId);
  } catch (err) {
    errorRedirect("/dashboard/expenses/categories", messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/expenses/categories");
  revalidatePath("/dashboard/expenses");
}

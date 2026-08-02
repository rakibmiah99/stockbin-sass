"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { expensesApi } from "@/lib/api/expenses";
import type { ExpensePayload } from "@/lib/api/expenses";
import { ApiError } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/cookies";

function messageOf(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

function errorRedirect(path: string, message: string): never {
  const params = new URLSearchParams({ error: message });
  redirect(`${path}?${params.toString()}`);
}

function buildPayload(formData: FormData): ExpensePayload {
  const note = String(formData.get("note") ?? "").trim();
  return {
    expense_category_id: Number(formData.get("expense_category_id") ?? 0),
    title: String(formData.get("title") ?? "").trim(),
    amount: Number(formData.get("amount") ?? 0),
    expense_date: String(formData.get("expense_date") ?? ""),
    ...(note ? { note } : {}),
  };
}

export async function createExpenseAction(formData: FormData): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const payload = buildPayload(formData);

  try {
    await expensesApi.create(token, payload);
  } catch (err) {
    errorRedirect("/dashboard/expenses/new", messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/expenses");
  redirect("/dashboard/expenses");
}

export async function updateExpenseAction(expenseId: number, formData: FormData): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const payload = buildPayload(formData);

  try {
    await expensesApi.update(token, expenseId, payload);
  } catch (err) {
    errorRedirect(`/dashboard/expenses/${expenseId}/edit`, messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/expenses");
  redirect("/dashboard/expenses");
}

export async function deleteExpenseAction(expenseId: number): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  try {
    await expensesApi.remove(token, expenseId);
  } catch (err) {
    errorRedirect("/dashboard/expenses", messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/expenses");
}

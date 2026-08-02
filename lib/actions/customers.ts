"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { customersApi } from "@/lib/api/customers";
import { ApiError } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/cookies";

function messageOf(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

function errorRedirect(path: string, message: string): never {
  const params = new URLSearchParams({ error: message });
  redirect(`${path}?${params.toString()}`);
}

export async function createCustomerAction(formData: FormData): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const customerName = String(formData.get("customer_name") ?? "").trim();
  const customerPhone = String(formData.get("customer_phone") ?? "").trim();

  try {
    await customersApi.create(token, { customer_name: customerName, customer_phone: customerPhone });
  } catch (err) {
    errorRedirect("/dashboard/customers/new", messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function updateCustomerAction(customerId: number, formData: FormData): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const customerName = String(formData.get("customer_name") ?? "").trim();
  const customerPhone = String(formData.get("customer_phone") ?? "").trim();

  try {
    await customersApi.update(token, customerId, {
      customer_name: customerName,
      customer_phone: customerPhone,
    });
  } catch (err) {
    errorRedirect(`/dashboard/customers/${customerId}/edit`, messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function deleteCustomerAction(customerId: number): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  try {
    await customersApi.remove(token, customerId);
  } catch (err) {
    errorRedirect("/dashboard/customers", messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/customers");
}

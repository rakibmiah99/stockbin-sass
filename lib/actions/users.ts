"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { usersApi } from "@/lib/api/users";
import type { UserRoleType } from "@/types/AuthType";
import { ApiError } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/cookies";

function messageOf(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

function errorRedirect(path: string, message: string): never {
  const params = new URLSearchParams({ error: message });
  redirect(`${path}?${params.toString()}`);
}

function parseRole(value: FormDataEntryValue | null): UserRoleType {
  return value === "admin" || value === "manager" ? value : "salesman";
}

export async function createUserAction(formData: FormData): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirmation = String(formData.get("password_confirmation") ?? "");
  const role = parseRole(formData.get("role"));
  const isActive = formData.get("is_active") === "on";

  if (password !== passwordConfirmation) {
    errorRedirect("/dashboard/users/new", "Passwords do not match.");
  }
  if (password.length < 8) {
    errorRedirect("/dashboard/users/new", "Password must be at least 8 characters.");
  }

  try {
    await usersApi.create(token, {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      role,
      is_active: isActive,
    });
  } catch (err) {
    errorRedirect("/dashboard/users/new", messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}

export async function updateUserAction(userId: number, formData: FormData): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const role = parseRole(formData.get("role"));
  const password = String(formData.get("password") ?? "");
  const passwordConfirmation = String(formData.get("password_confirmation") ?? "");

  const editPath = `/dashboard/users/${userId}/edit`;

  if (password && password !== passwordConfirmation) {
    errorRedirect(editPath, "Passwords do not match.");
  }
  if (password && password.length < 8) {
    errorRedirect(editPath, "Password must be at least 8 characters.");
  }

  try {
    await usersApi.update(token, userId, {
      name,
      email,
      role,
      ...(password ? { password, password_confirmation: passwordConfirmation } : {}),
    });
  } catch (err) {
    errorRedirect(editPath, messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}

export async function toggleUserStatusAction(userId: number, isActive: boolean): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  try {
    await usersApi.updateStatus(token, userId, isActive);
  } catch (err) {
    errorRedirect("/dashboard/users", messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/users");
}

export async function deleteUserAction(userId: number): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  try {
    await usersApi.remove(token, userId);
  } catch (err) {
    errorRedirect("/dashboard/users", messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/users");
}

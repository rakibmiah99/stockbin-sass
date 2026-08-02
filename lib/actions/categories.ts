"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { categoriesApi } from "@/lib/api/categories";
import { ApiError } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/cookies";

function messageOf(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

function errorRedirect(path: string, message: string): never {
  const params = new URLSearchParams({ error: message });
  redirect(`${path}?${params.toString()}`);
}

export async function createCategoryAction(formData: FormData): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    errorRedirect("/dashboard/products/categories", "Category name is required.");
  }

  const image = formData.get("image");
  const hasImage = image instanceof File && image.size > 0;

  try {
    if (hasImage) {
      const multipart = new FormData();
      multipart.set("name", name);
      multipart.set("image", image as File);
      await categoriesApi.createWithImage(token, multipart);
    } else {
      await categoriesApi.create(token, { name });
    }
  } catch (err) {
    errorRedirect("/dashboard/products/categories", messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/products/categories");
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products/categories");
}

export async function updateCategoryAction(categoryId: number, formData: FormData): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const editPath = `/dashboard/products/categories/${categoryId}/edit`;
  if (!name) {
    errorRedirect(editPath, "Category name is required.");
  }

  const image = formData.get("image");
  const hasImage = image instanceof File && image.size > 0;

  try {
    if (hasImage) {
      const multipart = new FormData();
      multipart.set("name", name);
      multipart.set("image", image as File);
      await categoriesApi.updateWithImage(token, categoryId, multipart);
    } else {
      await categoriesApi.update(token, categoryId, { name });
    }
  } catch (err) {
    errorRedirect(editPath, messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/products/categories");
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products/categories");
}

export async function deleteCategoryAction(categoryId: number): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  try {
    await categoriesApi.remove(token, categoryId);
  } catch (err) {
    errorRedirect("/dashboard/products/categories", messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/products/categories");
  revalidatePath("/dashboard/products");
}

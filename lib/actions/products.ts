"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { productsApi } from "@/lib/api/products";
import type { ProductPayload } from "@/lib/api/products";
import { ApiError } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/cookies";

function messageOf(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

function errorRedirect(path: string, message: string): never {
  const params = new URLSearchParams({ error: message });
  redirect(`${path}?${params.toString()}`);
}

function buildPayload(formData: FormData): ProductPayload {
  const color = String(formData.get("color") ?? "").trim();
  const size = String(formData.get("size") ?? "").trim();
  const weight = String(formData.get("weight") ?? "").trim();

  return {
    category_id: Number(formData.get("category_id") ?? 0),
    product_name: String(formData.get("product_name") ?? "").trim(),
    unit: String(formData.get("unit") ?? "").trim(),
    price: Number(formData.get("price") ?? 0),
    is_active: formData.get("is_active") === "on",
    ...(color ? { color } : {}),
    ...(size ? { size } : {}),
    ...(weight ? { weight } : {}),
  };
}

function buildMultipart(payload: ProductPayload, image: File): FormData {
  const multipart = new FormData();
  multipart.set("category_id", String(payload.category_id));
  multipart.set("product_name", payload.product_name);
  multipart.set("unit", payload.unit);
  multipart.set("price", String(payload.price));
  multipart.set("is_active", payload.is_active ? "1" : "0");
  if (payload.color) multipart.set("color", payload.color);
  if (payload.size) multipart.set("size", payload.size);
  if (payload.weight) multipart.set("weight", payload.weight);
  multipart.set("product_image", image);
  return multipart;
}

export async function createProductAction(formData: FormData): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const payload = buildPayload(formData);
  const image = formData.get("product_image");
  const hasImage = image instanceof File && image.size > 0;

  try {
    if (hasImage) {
      await productsApi.createWithImage(token, buildMultipart(payload, image));
    } else {
      await productsApi.create(token, payload);
    }
  } catch (err) {
    errorRedirect("/dashboard/products/new", messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function updateProductAction(productId: number, formData: FormData): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const payload = buildPayload(formData);
  const editPath = `/dashboard/products/${productId}/edit`;
  const image = formData.get("product_image");
  const hasImage = image instanceof File && image.size > 0;

  try {
    if (hasImage) {
      await productsApi.updateWithImage(token, productId, buildMultipart(payload, image));
    } else {
      await productsApi.update(token, productId, payload);
    }
  } catch (err) {
    errorRedirect(editPath, messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function deleteProductAction(productId: number): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  try {
    await productsApi.remove(token, productId);
  } catch (err) {
    errorRedirect("/dashboard/products", messageOf(err, "Something went wrong."));
  }

  revalidatePath("/dashboard/products");
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { colorsApi } from "@/lib/api/colors";
import { sizesApi } from "@/lib/api/sizes";
import { weightsApi } from "@/lib/api/weights";
import { productUnitsApi } from "@/lib/api/productUnits";
import { ApiError } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/cookies";

const VARIANTS_PATH = "/dashboard/products/variants";

function messageOf(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

function errorRedirect(message: string): never {
  const params = new URLSearchParams({ error: message });
  redirect(`${VARIANTS_PATH}?${params.toString()}`);
}

async function requireToken(): Promise<string> {
  const token = await getAuthToken();
  if (!token) redirect("/login");
  return token;
}

function revalidateVariants(): void {
  revalidatePath(VARIANTS_PATH);
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard/products/new");
}

// Colors

export async function createColorAction(formData: FormData): Promise<void> {
  const token = await requireToken();
  const name = String(formData.get("color_name") ?? "").trim();
  if (!name) errorRedirect("Color name is required.");

  try {
    await colorsApi.create(token, name);
  } catch (err) {
    errorRedirect(messageOf(err, "Something went wrong."));
  }

  revalidateVariants();
  redirect(VARIANTS_PATH);
}

export async function updateColorAction(id: number, formData: FormData): Promise<void> {
  const token = await requireToken();
  const name = String(formData.get("color_name") ?? "").trim();
  if (!name) errorRedirect("Color name is required.");

  try {
    await colorsApi.update(token, id, name);
  } catch (err) {
    errorRedirect(messageOf(err, "Something went wrong."));
  }

  revalidateVariants();
  redirect(VARIANTS_PATH);
}

export async function deleteColorAction(id: number): Promise<void> {
  const token = await requireToken();

  try {
    await colorsApi.remove(token, id);
  } catch (err) {
    errorRedirect(messageOf(err, "Something went wrong."));
  }

  revalidateVariants();
}

// Sizes

export async function createSizeAction(formData: FormData): Promise<void> {
  const token = await requireToken();
  const name = String(formData.get("size_name") ?? "").trim();
  if (!name) errorRedirect("Size name is required.");

  try {
    await sizesApi.create(token, name);
  } catch (err) {
    errorRedirect(messageOf(err, "Something went wrong."));
  }

  revalidateVariants();
  redirect(VARIANTS_PATH);
}

export async function updateSizeAction(id: number, formData: FormData): Promise<void> {
  const token = await requireToken();
  const name = String(formData.get("size_name") ?? "").trim();
  if (!name) errorRedirect("Size name is required.");

  try {
    await sizesApi.update(token, id, name);
  } catch (err) {
    errorRedirect(messageOf(err, "Something went wrong."));
  }

  revalidateVariants();
  redirect(VARIANTS_PATH);
}

export async function deleteSizeAction(id: number): Promise<void> {
  const token = await requireToken();

  try {
    await sizesApi.remove(token, id);
  } catch (err) {
    errorRedirect(messageOf(err, "Something went wrong."));
  }

  revalidateVariants();
}

// Weights

export async function createWeightAction(formData: FormData): Promise<void> {
  const token = await requireToken();
  const name = String(formData.get("weight_name") ?? "").trim();
  if (!name) errorRedirect("Weight name is required.");

  try {
    await weightsApi.create(token, name);
  } catch (err) {
    errorRedirect(messageOf(err, "Something went wrong."));
  }

  revalidateVariants();
  redirect(VARIANTS_PATH);
}

export async function updateWeightAction(id: number, formData: FormData): Promise<void> {
  const token = await requireToken();
  const name = String(formData.get("weight_name") ?? "").trim();
  if (!name) errorRedirect("Weight name is required.");

  try {
    await weightsApi.update(token, id, name);
  } catch (err) {
    errorRedirect(messageOf(err, "Something went wrong."));
  }

  revalidateVariants();
  redirect(VARIANTS_PATH);
}

export async function deleteWeightAction(id: number): Promise<void> {
  const token = await requireToken();

  try {
    await weightsApi.remove(token, id);
  } catch (err) {
    errorRedirect(messageOf(err, "Something went wrong."));
  }

  revalidateVariants();
}

// Product Units

export async function createUnitAction(formData: FormData): Promise<void> {
  const token = await requireToken();
  const name = String(formData.get("unit_name") ?? "").trim();
  if (!name) errorRedirect("Unit name is required.");

  try {
    await productUnitsApi.create(token, name);
  } catch (err) {
    errorRedirect(messageOf(err, "Something went wrong."));
  }

  revalidateVariants();
  redirect(VARIANTS_PATH);
}

export async function updateUnitAction(id: number, formData: FormData): Promise<void> {
  const token = await requireToken();
  const name = String(formData.get("unit_name") ?? "").trim();
  if (!name) errorRedirect("Unit name is required.");

  try {
    await productUnitsApi.update(token, id, name);
  } catch (err) {
    errorRedirect(messageOf(err, "Something went wrong."));
  }

  revalidateVariants();
  redirect(VARIANTS_PATH);
}

export async function deleteUnitAction(id: number): Promise<void> {
  const token = await requireToken();

  try {
    await productUnitsApi.remove(token, id);
  } catch (err) {
    errorRedirect(messageOf(err, "Something went wrong."));
  }

  revalidateVariants();
}

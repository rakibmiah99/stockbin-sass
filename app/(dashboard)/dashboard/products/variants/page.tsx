import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { colorsApi } from "@/lib/api/colors";
import { sizesApi } from "@/lib/api/sizes";
import { weightsApi } from "@/lib/api/weights";
import { productUnitsApi } from "@/lib/api/productUnits";
import { ApiError } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/cookies";
import {
  createColorAction,
  updateColorAction,
  deleteColorAction,
  createSizeAction,
  updateSizeAction,
  deleteSizeAction,
  createWeightAction,
  updateWeightAction,
  deleteWeightAction,
  createUnitAction,
  updateUnitAction,
  deleteUnitAction,
} from "@/lib/actions/variants";
import { VariantSection } from "@/components/products/VariantSection";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Manage Variants",
};

export default async function ManageVariantsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const token = await getAuthToken();
  if (!token) redirect("/login");

  let colors: Awaited<ReturnType<typeof colorsApi.list>> = [];
  let sizes: Awaited<ReturnType<typeof sizesApi.list>> = [];
  let weights: Awaited<ReturnType<typeof weightsApi.list>> = [];
  let units: Awaited<ReturnType<typeof productUnitsApi.list>> = [];
  let loadError: string | null = null;

  try {
    [colors, sizes, weights, units] = await Promise.all([
      colorsApi.list(token),
      sizesApi.list(token),
      weightsApi.list(token),
      productUnitsApi.list(token),
    ]);
  } catch (err) {
    loadError = err instanceof ApiError ? err.message : "Couldn't load variants.";
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-xl">
      <div className="flex flex-col gap-base sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h4 font-semibold text-foreground">Manage variants</h1>
          <p className="text-body text-muted">
            Maintain the colors, sizes, weights, and units used when creating products.
          </p>
        </div>
        <Link href="/dashboard/products" className="text-small font-medium text-primary hover:opacity-80">
          Back to products
        </Link>
      </div>

      <FormError message={error ?? null} />
      {loadError && <FormError message={loadError} />}

      <div className="grid grid-cols-1 gap-lg sm:grid-cols-2">
        <VariantSection
          title="Colors"
          fieldName="color_name"
          placeholder="Midnight Blue"
          items={colors.map((c) => ({ id: c.id, name: c.color_name }))}
          createAction={createColorAction}
          updateAction={updateColorAction}
          deleteAction={deleteColorAction}
        />
        <VariantSection
          title="Sizes"
          fieldName="size_name"
          placeholder="XL"
          items={sizes.map((s) => ({ id: s.id, name: s.size_name }))}
          createAction={createSizeAction}
          updateAction={updateSizeAction}
          deleteAction={deleteSizeAction}
        />
        <VariantSection
          title="Weights"
          fieldName="weight_name"
          placeholder="250g"
          items={weights.map((w) => ({ id: w.id, name: w.weight_name }))}
          createAction={createWeightAction}
          updateAction={updateWeightAction}
          deleteAction={deleteWeightAction}
        />
        <VariantSection
          title="Units"
          fieldName="unit_name"
          placeholder="pcs"
          items={units.map((u) => ({ id: u.id, name: u.unit_name }))}
          createAction={createUnitAction}
          updateAction={updateUnitAction}
          deleteAction={deleteUnitAction}
        />
      </div>
    </div>
  );
}

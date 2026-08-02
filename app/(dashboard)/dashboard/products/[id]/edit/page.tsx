import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { categoriesApi } from "@/lib/api/categories";
import { colorsApi } from "@/lib/api/colors";
import { sizesApi } from "@/lib/api/sizes";
import { weightsApi } from "@/lib/api/weights";
import { productUnitsApi } from "@/lib/api/productUnits";
import { getAuthToken } from "@/lib/auth/cookies";
import { updateProductAction } from "@/lib/actions/products";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Edit Product",
};

/** Keeps the product's current value selectable even if it's since been renamed or removed from the master list. */
function withCurrent(names: string[], current: string | undefined): string[] {
  if (!current || names.includes(current)) return names;
  return [...names, current];
}

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    category_id?: string;
    name?: string;
    unit?: string;
    color?: string;
    size?: string;
    weight?: string;
    price?: string;
    active?: string;
    image?: string;
    error?: string;
  }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) notFound();

  const sp = await searchParams;
  // The API has no single-product GET endpoint, so the products list page
  // passes the current field values through the edit link's query string.
  if (!sp.name || !sp.unit || !sp.price || !sp.category_id) {
    redirect("/dashboard/products");
  }

  const token = await getAuthToken();
  if (!token) redirect("/login");

  const [categories, units, colors, sizes, weights] = await Promise.all([
    categoriesApi.list(token).catch(() => []),
    productUnitsApi.list(token).catch(() => []),
    colorsApi.list(token).catch(() => []),
    sizesApi.list(token).catch(() => []),
    weightsApi.list(token).catch(() => []),
  ]);

  const unitOptions = withCurrent(units.map((u) => u.unit_name), sp.unit);
  const colorOptions = withCurrent(colors.map((c) => c.color_name), sp.color);
  const sizeOptions = withCurrent(sizes.map((s) => s.size_name), sp.size);
  const weightOptions = withCurrent(weights.map((w) => w.weight_name), sp.weight);

  const updateProductWithId = updateProductAction.bind(null, productId);

  return (
    <div className="mx-auto flex w-full flex-col gap-xl">
      <div className="flex flex-col gap-xs">
        <h1 className="text-h4 font-semibold text-foreground">Edit product</h1>
        <p className="text-body text-muted">Update this product&apos;s details.</p>
      </div>

      <form
        action={updateProductWithId}
        encType="multipart/form-data"
        className="flex flex-col gap-lg rounded-lg border border-border bg-surface p-lg"
      >
        <FormError message={sp.error ?? null} />

        <FormField id="category_id" label="Category">
          <Select id="category_id" name="category_id" required defaultValue={sp.category_id}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField id="product_name" label="Product name">
          <Input id="product_name" name="product_name" required defaultValue={sp.name} />
        </FormField>

        <FormField id="product_image" label="Product image (optional)">
          <div className="flex items-center gap-base">
            {sp.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sp.image}
                alt="Current product image"
                className="size-14 shrink-0 rounded-md border border-border object-cover"
              />
            ) : null}
            <input
              id="product_image"
              name="product_image"
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif"
              className="block w-full text-small text-muted file:mr-base file:h-9 file:rounded-md file:border file:border-border file:bg-surface file:px-base file:text-small file:font-medium file:text-foreground hover:file:bg-surface-secondary"
            />
          </div>
          <p className="text-caption text-muted">Leave empty to keep the current image.</p>
        </FormField>

        <div className="grid grid-cols-1 gap-lg sm:grid-cols-2">
          <FormField id="unit" label="Unit">
            <Select id="unit" name="unit" required defaultValue={sp.unit}>
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField id="price" label="Price">
            <Input id="price" name="price" type="number" step="0.01" min="0" required defaultValue={sp.price} />
          </FormField>

          <FormField id="color" label="Color (optional)">
            <Select id="color" name="color" defaultValue={sp.color ?? ""}>
              <option value="">None</option>
              {colorOptions.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField id="size" label="Size (optional)">
            <Select id="size" name="size" defaultValue={sp.size ?? ""}>
              <option value="">None</option>
              {sizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField id="weight" label="Weight (optional)">
            <Select id="weight" name="weight" defaultValue={sp.weight ?? ""}>
              <option value="">None</option>
              {weightOptions.map((weight) => (
                <option key={weight} value={weight}>
                  {weight}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <p className="text-small text-muted">
          Need more options?{" "}
          <Link href="/dashboard/products/variants" className="font-medium text-primary hover:opacity-80">
            Manage variants
          </Link>
          .
        </p>

        <Checkbox id="is_active" name="is_active" label="Active" defaultChecked={sp.active !== "0"} />

        <div className="flex items-center gap-base">
          <Button type="submit">Save changes</Button>
          <Link href="/dashboard/products" className="text-small font-medium text-muted hover:text-foreground">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

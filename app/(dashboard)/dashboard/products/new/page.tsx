import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { categoriesApi } from "@/lib/api/categories";
import { colorsApi } from "@/lib/api/colors";
import { sizesApi } from "@/lib/api/sizes";
import { weightsApi } from "@/lib/api/weights";
import { productUnitsApi } from "@/lib/api/productUnits";
import { getAuthToken } from "@/lib/auth/cookies";
import { createProductAction } from "@/lib/actions/products";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Add Product",
};

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const token = await getAuthToken();
  if (!token) redirect("/login");

  const [categories, units, colors, sizes, weights] = await Promise.all([
    categoriesApi.list(token).catch(() => []),
    productUnitsApi.list(token).catch(() => []),
    colorsApi.list(token).catch(() => []),
    sizesApi.list(token).catch(() => []),
    weightsApi.list(token).catch(() => []),
  ]);

  return (
    <div className="mx-auto flex w-full flex-col gap-xl">
      <div className="flex flex-col gap-xs">
        <h1 className="text-h4 font-semibold text-foreground">Add product</h1>
        <p className="text-body text-muted">Create a new product in your catalog.</p>
      </div>

      <form
        action={createProductAction}
        encType="multipart/form-data"
        className="flex flex-col gap-lg rounded-lg border border-border bg-surface p-lg"
      >
        <FormError message={error ?? null} />

        {categories.length === 0 ? (
          <p className="text-small text-muted">
            You need a category first.{" "}
            <Link href="/dashboard/products/categories" className="font-medium text-primary hover:opacity-80">
              Create one
            </Link>
            .
          </p>
        ) : (
          <FormField id="category_id" label="Category">
            <Select id="category_id" name="category_id" required defaultValue="">
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormField>
        )}

        <FormField id="product_name" label="Product name">
          <Input id="product_name" name="product_name" required placeholder="Premium T-Shirt" />
        </FormField>

        <FormField id="product_image" label="Product image (optional)">
          <input
            id="product_image"
            name="product_image"
            type="file"
            accept=".png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif"
            className="block w-full text-small text-muted file:mr-base file:h-9 file:rounded-md file:border file:border-border file:bg-surface file:px-base file:text-small file:font-medium file:text-foreground hover:file:bg-surface-secondary"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-lg sm:grid-cols-2">
          <FormField id="unit" label="Unit">
            {units.length === 0 ? (
              <p className="text-small text-muted">
                No units yet.{" "}
                <Link href="/dashboard/products/variants" className="font-medium text-primary hover:opacity-80">
                  Add one
                </Link>
                .
              </p>
            ) : (
              <Select id="unit" name="unit" required defaultValue="">
                <option value="" disabled>
                  Select a unit
                </option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.unit_name}>
                    {unit.unit_name}
                  </option>
                ))}
              </Select>
            )}
          </FormField>

          <FormField id="price" label="Price">
            <Input id="price" name="price" type="number" step="0.01" min="0" required placeholder="0.00" />
          </FormField>

          <FormField id="color" label="Color (optional)">
            <Select id="color" name="color" defaultValue="">
              <option value="">None</option>
              {colors.map((color) => (
                <option key={color.id} value={color.color_name}>
                  {color.color_name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField id="size" label="Size (optional)">
            <Select id="size" name="size" defaultValue="">
              <option value="">None</option>
              {sizes.map((size) => (
                <option key={size.id} value={size.size_name}>
                  {size.size_name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField id="weight" label="Weight (optional)">
            <Select id="weight" name="weight" defaultValue="">
              <option value="">None</option>
              {weights.map((weight) => (
                <option key={weight.id} value={weight.weight_name}>
                  {weight.weight_name}
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

        <Checkbox id="is_active" name="is_active" label="Active" defaultChecked />

        <div className="flex items-center gap-base">
          <Button type="submit" disabled={categories.length === 0 || units.length === 0}>
            Save product
          </Button>
          <Link href="/dashboard/products" className="text-small font-medium text-muted hover:text-foreground">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

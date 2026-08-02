import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { categoriesApi } from "@/lib/api/categories";
import { ApiError } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/cookies";
import { createCategoryAction } from "@/lib/actions/categories";
import { DeleteCategoryButton } from "@/components/products/DeleteCategoryButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Product Categories",
};

export default async function ProductCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const token = await getAuthToken();
  if (!token) redirect("/login");

  let categories: Awaited<ReturnType<typeof categoriesApi.list>> = [];
  let loadError: string | null = null;
  try {
    categories = await categoriesApi.list(token);
  } catch (err) {
    loadError = err instanceof ApiError ? err.message : "Couldn't load categories.";
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-xl">
      <div className="flex flex-col gap-base sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h4 font-semibold text-foreground">Product categories</h1>
          <p className="text-body text-muted">Organize your product catalog into categories.</p>
        </div>
        <Link href="/dashboard/products" className="text-small font-medium text-primary hover:opacity-80">
          Back to products
        </Link>
      </div>

      <FormError message={error ?? null} />

      <form
        action={createCategoryAction}
        encType="multipart/form-data"
        className="flex flex-col gap-lg rounded-lg border border-border bg-surface p-lg"
      >
        <h2 className="text-h5 font-semibold text-foreground">Add category</h2>

        <FormField id="name" label="Name">
          <Input id="name" name="name" required placeholder="Electronics" />
        </FormField>

        <FormField id="image" label="Image (optional)">
          <input
            id="image"
            name="image"
            type="file"
            accept=".png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif"
            className="block w-full text-small text-muted file:mr-base file:h-9 file:rounded-md file:border file:border-border file:bg-surface file:px-base file:text-small file:font-medium file:text-foreground hover:file:bg-surface-secondary"
          />
        </FormField>

        <Button type="submit" className="self-start">
          Add category
        </Button>
      </form>

      {loadError ? (
        <FormError message={loadError} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-body">
            <thead className="border-b border-divider text-small text-muted">
              <tr>
                <th className="px-lg py-sm font-medium">Category</th>
                <th className="px-lg py-sm font-medium">Products</th>
                <th className="px-lg py-sm text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-divider last:border-0">
                  <td className="px-lg py-base">
                    <div className="flex items-center gap-sm">
                      {category.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={category.image}
                          alt={category.name}
                          className="size-10 shrink-0 rounded-md border border-border object-cover"
                        />
                      ) : (
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface-secondary text-caption text-muted">
                          No img
                        </div>
                      )}
                      <span className="font-medium text-foreground">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-lg py-base text-muted">{category.total_product}</td>
                  <td className="px-lg py-base">
                    <div className="flex items-center justify-end gap-sm">
                      <Link
                        href={{
                          pathname: `/dashboard/products/categories/${category.id}/edit`,
                          query: { name: category.name, image: category.image ?? "" },
                        }}
                        className="rounded-md px-sm py-xs text-small font-medium text-primary hover:bg-surface-secondary"
                      >
                        Edit
                      </Link>
                      <DeleteCategoryButton categoryId={category.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-lg py-xl text-center text-muted">
                    No categories yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

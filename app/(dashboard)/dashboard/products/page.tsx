import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { productsApi } from "@/lib/api/products";
import { shopSettingsApi } from "@/lib/api/shopSettings";
import { ApiError } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/cookies";
import { formatMoney } from "@/lib/format";
import { DeleteProductButton } from "@/components/products/DeleteProductButton";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Products",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const token = await getAuthToken();
  if (!token) redirect("/login");

  let products: Awaited<ReturnType<typeof productsApi.list>> = [];
  let currencySymbol = "৳";
  let loadError: string | null = null;

  try {
    const [productList, shopSettings] = await Promise.all([
      productsApi.list(token),
      shopSettingsApi.get(token).catch(() => null),
    ]);
    products = productList;
    currencySymbol = shopSettings?.currency_symbol ?? "৳";
  } catch (err) {
    loadError = err instanceof ApiError ? err.message : "Couldn't load products.";
  }

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-col gap-base sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h4 font-semibold text-foreground">Products</h1>
          <p className="text-body text-muted">Manage your product catalog.</p>
        </div>
        <div className="flex items-center gap-sm">
          <Link href="/dashboard/products/categories">
            <Button variant="outline">Categories</Button>
          </Link>
          <Link href="/dashboard/products/variants">
            <Button variant="outline">Variants</Button>
          </Link>
          <Link href="/dashboard/products/new">
            <Button>
              <Plus className="size-4" />
              Add product
            </Button>
          </Link>
        </div>
      </div>

      <FormError message={error ?? null} />

      {loadError ? (
        <FormError message={loadError} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-body">
            <thead className="border-b border-divider text-small text-muted">
              <tr>
                <th className="px-lg py-sm font-medium">Product</th>
                <th className="px-lg py-sm font-medium">Code</th>
                <th className="px-lg py-sm font-medium">Category</th>
                <th className="px-lg py-sm font-medium">Attributes</th>
                <th className="px-lg py-sm font-medium">Price</th>
                <th className="px-lg py-sm font-medium">Status</th>
                <th className="px-lg py-sm text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-divider last:border-0">
                  <td className="px-lg py-base">
                    <div className="flex items-center gap-sm">
                      {product.product_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.product_image}
                          alt={product.product_name}
                          className="size-10 shrink-0 rounded-md border border-border object-cover"
                        />
                      ) : (
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface-secondary text-caption text-muted">
                          No img
                        </div>
                      )}
                      <span className="font-medium text-foreground">{product.product_name}</span>
                    </div>
                  </td>
                  <td className="px-lg py-base text-muted">{product.product_code}</td>
                  <td className="px-lg py-base text-muted">{product.category.name}</td>
                  <td className="px-lg py-base text-muted">
                    {[product.unit, product.color, product.size, product.weight].filter(Boolean).join(" · ")}
                  </td>
                  <td className="px-lg py-base text-foreground">{formatMoney(product.price, currencySymbol)}</td>
                  <td className="px-lg py-base">
                    <span
                      className={cn(
                        "rounded-full px-sm py-xs text-caption font-medium",
                        product.is_active ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                      )}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-lg py-base">
                    <div className="flex items-center justify-end gap-sm">
                      <Link
                        href={{
                          pathname: `/dashboard/products/${product.id}/edit`,
                          query: {
                            category_id: String(product.category_id),
                            name: product.product_name,
                            unit: product.unit,
                            color: product.color ?? "",
                            size: product.size ?? "",
                            weight: product.weight ?? "",
                            price: product.price,
                            active: product.is_active ? "1" : "0",
                            image: product.product_image ?? "",
                          },
                        }}
                        className="rounded-md px-sm py-xs text-small font-medium text-primary hover:bg-surface-secondary"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-lg py-xl text-center text-muted">
                    No products yet.
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

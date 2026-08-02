import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth/cookies";
import { updateCategoryAction } from "@/lib/actions/categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Edit Category",
};

export default async function EditProductCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; image?: string; error?: string }>;
}) {
  const { id } = await params;
  const categoryId = Number(id);
  if (!Number.isFinite(categoryId)) notFound();

  const sp = await searchParams;
  // The API has no single-category GET endpoint, so the categories list page
  // passes the current field values through the edit link's query string.
  if (!sp.name) {
    redirect("/dashboard/products/categories");
  }

  const token = await getAuthToken();
  if (!token) redirect("/login");

  const updateCategoryWithId = updateCategoryAction.bind(null, categoryId);

  return (
    <div className="mx-auto flex w-full flex-col gap-xl">
      <div className="flex flex-col gap-xs">
        <h1 className="text-h4 font-semibold text-foreground">Edit category</h1>
        <p className="text-body text-muted">Update the &quot;{sp.name}&quot; category.</p>
      </div>

      <form
        action={updateCategoryWithId}
        encType="multipart/form-data"
        className="flex flex-col gap-lg rounded-lg border border-border bg-surface p-lg"
      >
        <FormError message={sp.error ?? null} />

        <FormField id="name" label="Name">
          <Input id="name" name="name" required defaultValue={sp.name} />
        </FormField>

        <FormField id="image" label="Image (optional)">
          <div className="flex items-center gap-base">
            {sp.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sp.image}
                alt="Current category image"
                className="size-14 shrink-0 rounded-md border border-border object-cover"
              />
            ) : null}
            <input
              id="image"
              name="image"
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif"
              className="block w-full text-small text-muted file:mr-base file:h-9 file:rounded-md file:border file:border-border file:bg-surface file:px-base file:text-small file:font-medium file:text-foreground hover:file:bg-surface-secondary"
            />
          </div>
          <p className="text-caption text-muted">Leave empty to keep the current image.</p>
        </FormField>

        <div className="flex items-center gap-base">
          <Button type="submit">Save changes</Button>
          <Link
            href="/dashboard/products/categories"
            className="text-small font-medium text-muted hover:text-foreground"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

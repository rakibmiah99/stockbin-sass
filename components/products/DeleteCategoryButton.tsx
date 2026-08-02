"use client";

import type { FormEvent } from "react";
import { deleteCategoryAction } from "@/lib/actions/categories";

export function DeleteCategoryButton({ categoryId }: { categoryId: number }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm("Delete this category? This cannot be undone.")) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteCategoryAction.bind(null, categoryId)} onSubmit={handleSubmit}>
      <button
        type="submit"
        className="rounded-md px-sm py-xs text-small font-medium text-danger transition-colors duration-[var(--motion-duration-fast)] hover:bg-danger/10"
      >
        Delete
      </button>
    </form>
  );
}

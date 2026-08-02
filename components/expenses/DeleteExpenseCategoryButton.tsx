"use client";

import type { FormEvent } from "react";
import { deleteExpenseCategoryAction } from "@/lib/actions/expenseCategories";

export function DeleteExpenseCategoryButton({ categoryId }: { categoryId: number }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm("Delete this category? This cannot be undone.")) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteExpenseCategoryAction.bind(null, categoryId)} onSubmit={handleSubmit}>
      <button
        type="submit"
        className="rounded-md px-sm py-xs text-small font-medium text-danger transition-colors duration-[var(--motion-duration-fast)] hover:bg-danger/10"
      >
        Delete
      </button>
    </form>
  );
}

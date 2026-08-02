"use client";

import type { FormEvent } from "react";
import { deleteExpenseAction } from "@/lib/actions/expenses";

export function DeleteExpenseButton({ expenseId }: { expenseId: number }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm("Delete this expense? This cannot be undone.")) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteExpenseAction.bind(null, expenseId)} onSubmit={handleSubmit}>
      <button
        type="submit"
        className="rounded-md px-sm py-xs text-small font-medium text-danger transition-colors duration-[var(--motion-duration-fast)] hover:bg-danger/10"
      >
        Delete
      </button>
    </form>
  );
}

"use client";

import type { FormEvent } from "react";
import { deleteCustomerAction } from "@/lib/actions/customers";

export function DeleteCustomerButton({ customerId }: { customerId: number }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm("Delete this customer? This cannot be undone.")) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteCustomerAction.bind(null, customerId)} onSubmit={handleSubmit}>
      <button
        type="submit"
        className="rounded-md px-sm py-xs text-small font-medium text-danger transition-colors duration-[var(--motion-duration-fast)] hover:bg-danger/10"
      >
        Delete
      </button>
    </form>
  );
}

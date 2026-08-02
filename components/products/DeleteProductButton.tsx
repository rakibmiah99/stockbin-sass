"use client";

import type { FormEvent } from "react";
import { deleteProductAction } from "@/lib/actions/products";

export function DeleteProductButton({ productId }: { productId: number }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm("Delete this product? This cannot be undone.")) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteProductAction.bind(null, productId)} onSubmit={handleSubmit}>
      <button
        type="submit"
        className="rounded-md px-sm py-xs text-small font-medium text-danger transition-colors duration-[var(--motion-duration-fast)] hover:bg-danger/10"
      >
        Delete
      </button>
    </form>
  );
}

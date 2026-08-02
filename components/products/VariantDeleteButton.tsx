"use client";

import type { FormEvent } from "react";

export function VariantDeleteButton({
  action,
  label,
}: {
  action: (formData: FormData) => Promise<void>;
  label: string;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) {
      event.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit}>
      <button
        type="submit"
        className="rounded-md px-sm py-xs text-small font-medium text-danger transition-colors duration-[var(--motion-duration-fast)] hover:bg-danger/10"
      >
        Delete
      </button>
    </form>
  );
}

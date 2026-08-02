"use client";

import type { FormEvent } from "react";
import { deleteUserAction } from "@/lib/actions/users";
import { cn } from "@/lib/utils";

export function DeleteUserButton({ userId, disabled }: { userId: number; disabled?: boolean }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm("Delete this user? This cannot be undone.")) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteUserAction.bind(null, userId)} onSubmit={handleSubmit}>
      <button
        type="submit"
        disabled={disabled}
        title={disabled ? "You can't delete your own account" : undefined}
        className={cn(
          "rounded-md px-sm py-xs text-small font-medium text-danger transition-colors duration-[var(--motion-duration-fast)]",
          "hover:bg-danger/10",
          "disabled:cursor-not-allowed disabled:text-disabled-foreground disabled:hover:bg-transparent"
        )}
      >
        Delete
      </button>
    </form>
  );
}

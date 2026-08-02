import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-surface-secondary px-base py-3xl">
      <div className="w-full max-w-[768px]">
        <div className="mb-2xl flex items-center justify-center gap-sm">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold">
            S
          </span>
          <span className="text-h4 font-semibold text-foreground">Stockbin</span>
        </div>

        <div className="rounded-xl border border-border bg-surface p-2xl shadow-md">
          {children}
        </div>
      </div>
    </div>
  );
}

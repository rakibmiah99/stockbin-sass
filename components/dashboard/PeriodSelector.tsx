import Link from "next/link";
import { cn } from "@/lib/utils";
import type { DashboardPeriod } from "@/lib/api/dashboard";

const PERIODS: { value: DashboardPeriod; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "last_7_days", label: "7 days" },
  { value: "last_30_days", label: "30 days" },
  { value: "last_60_days", label: "60 days" },
  { value: "last_90_days", label: "90 days" },
];

/**
 * Plain links that change the `?period=` query string — no client JS needed.
 * Navigation re-renders the (Server Component) dashboard page with fresh data.
 */
export function PeriodSelector({ value }: { value: DashboardPeriod }) {
  return (
    <div className="inline-flex items-center gap-xs rounded-md border border-border bg-surface p-xs">
      {PERIODS.map((period) => (
        <Link
          key={period.value}
          href={period.value === "last_7_days" ? "/dashboard" : `/dashboard?period=${period.value}`}
          className={cn(
            "rounded-sm px-base py-xs text-small font-medium transition-colors duration-[var(--motion-duration-fast)]",
            value === period.value
              ? "bg-primary text-primary-foreground"
              : "text-muted hover:bg-surface-secondary hover:text-foreground"
          )}
        >
          {period.label}
        </Link>
      ))}
    </div>
  );
}

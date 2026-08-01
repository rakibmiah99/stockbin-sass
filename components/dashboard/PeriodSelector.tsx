"use client";

import { cn } from "@/lib/utils";
import type { DashboardPeriod } from "@/lib/api/dashboard";

const PERIODS: { value: DashboardPeriod; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "last_7_days", label: "7 days" },
  { value: "last_30_days", label: "30 days" },
  { value: "last_60_days", label: "60 days" },
  { value: "last_90_days", label: "90 days" },
];

export function PeriodSelector({
  value,
  onChange,
}: {
  value: DashboardPeriod;
  onChange: (period: DashboardPeriod) => void;
}) {
  return (
    <div className="inline-flex items-center gap-xs rounded-md border border-border bg-surface p-xs">
      {PERIODS.map((period) => (
        <button
          key={period.value}
          type="button"
          onClick={() => onChange(period.value)}
          className={cn(
            "rounded-sm px-base py-xs text-small font-medium transition-colors duration-[var(--motion-duration-fast)]",
            value === period.value
              ? "bg-primary text-primary-foreground"
              : "text-muted hover:bg-surface-secondary hover:text-foreground"
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}

import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export type StatTone = "primary" | "success" | "warning" | "danger" | "info" | "neutral";

const TONE_STYLES: Record<StatTone, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success-background text-success-foreground",
  warning: "bg-warning/15 text-warning-foreground",
  danger: "bg-danger/10 text-danger",
  info: "bg-info-background text-info-foreground",
  neutral: "bg-surface-secondary text-muted",
};

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  helpText?: string;
  trendPercent?: number | null;
  tone?: StatTone;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  helpText,
  trendPercent,
  tone = "primary",
}: StatCardProps) {
  const hasTrend = typeof trendPercent === "number";
  const isUp = hasTrend && trendPercent! > 0;
  const isDown = hasTrend && trendPercent! < 0;

  return (
    <Card className="flex flex-col gap-md">
      <div className="flex items-center justify-between">
        <span className={cn("flex size-10 items-center justify-center rounded-md", TONE_STYLES[tone])}>
          <Icon className="size-5" strokeWidth={2} />
        </span>
        {hasTrend && (
          <span
            className={cn(
              "flex items-center gap-xs rounded-full px-sm py-xs text-caption font-medium",
              isUp && "bg-success-background text-success-foreground",
              isDown && "bg-danger/10 text-danger",
              !isUp && !isDown && "bg-surface-secondary text-muted"
            )}
          >
            {isUp && <ArrowUpRight className="size-3" />}
            {isDown && <ArrowDownRight className="size-3" />}
            {Math.abs(trendPercent!).toFixed(1)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-small text-muted">{label}</p>
        <p className="mt-xs text-h3 font-semibold text-foreground">{value}</p>
        {helpText ? <p className="mt-xs text-caption text-muted">{helpText}</p> : null}
      </div>
    </Card>
  );
}

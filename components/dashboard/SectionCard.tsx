import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export function SectionCard({
  icon: Icon,
  title,
  count,
  children,
}: {
  icon: LucideIcon;
  title: string;
  count?: number;
  children: ReactNode;
}) {
  return (
    <Card className="flex flex-col p-0">
      <div className="flex items-center justify-between border-b border-divider px-lg py-base">
        <div className="flex items-center gap-sm">
          <Icon className="size-4 text-muted" />
          <h2 className="text-h5 font-semibold text-foreground">{title}</h2>
        </div>
        {typeof count === "number" ? (
          <span className="rounded-full bg-surface-secondary px-sm py-xs text-caption font-medium text-muted">
            {count}
          </span>
        ) : null}
      </div>
      <div>{children}</div>
    </Card>
  );
}

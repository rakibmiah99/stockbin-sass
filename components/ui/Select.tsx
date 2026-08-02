import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, invalid, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-11 w-full rounded-md border bg-surface px-base text-body text-foreground",
        "transition-colors duration-[var(--motion-duration-fast)]",
        "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
        "disabled:bg-disabled disabled:text-disabled-foreground disabled:cursor-not-allowed",
        invalid ? "border-danger" : "border-border",
        className
      )}
      {...props}
    />
  );
});

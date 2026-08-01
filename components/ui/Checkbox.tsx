import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, label, id, ...props },
  ref
) {
  return (
    <label
      htmlFor={id}
      className="inline-flex select-none items-center gap-sm text-small text-foreground"
    >
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={cn(
          "size-4 rounded-xs border border-border accent-primary",
          "focus:outline-none focus:ring-2 focus:ring-primary/40",
          className
        )}
        {...props}
      />
      {label}
    </label>
  );
});

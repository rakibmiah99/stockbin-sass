import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-11 w-full rounded-md border bg-surface px-base text-body text-foreground",
        "placeholder:text-placeholder",
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

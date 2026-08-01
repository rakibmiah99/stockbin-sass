import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium " +
  "transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-easing-standard)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 " +
  "disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-foreground disabled:hover:opacity-100";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90 active:opacity-100",
  secondary: "bg-secondary text-foreground hover:opacity-90 active:opacity-100",
  outline: "border border-border bg-surface text-foreground hover:bg-surface-secondary",
  ghost: "bg-transparent text-foreground hover:bg-surface-secondary",
  danger: "bg-danger text-danger-foreground hover:opacity-90 active:opacity-100",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-sm text-small",
  md: "h-11 px-base text-body",
  lg: "h-12 px-lg text-body-lg",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...props}
    />
  );
}

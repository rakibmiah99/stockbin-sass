"use client";

import { forwardRef, useState } from "react";
import { Input, type InputProps } from "./Input";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { EyeOffIcon } from "@/components/icons/EyeOffIcon";
import { cn } from "@/lib/utils";

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(function PasswordInput(
  { className, ...props },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        className={cn("pr-4xl", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex w-4xl items-center justify-center text-muted hover:text-foreground"
      >
        {visible ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
      </button>
    </div>
  );
});

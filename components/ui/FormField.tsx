import type { ReactNode } from "react";
import { Label } from "./Label";

export interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  error?: string;
}

export function FormField({ id, label, children, error }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-sm">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-caption text-danger">{error}</p> : null}
    </div>
  );
}

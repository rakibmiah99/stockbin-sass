import type { SVGProps } from "react";

export function EyeOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 3l18 18" />
      <path d="M10.58 10.59a3 3 0 0 0 4.24 4.24" />
      <path d="M9.88 5.09A10.7 10.7 0 0 1 12 4.5c6.5 0 10.5 7.5 10.5 7.5a13.9 13.9 0 0 1-3.1 3.9M6.6 6.6C3.7 8.4 1.5 12 1.5 12s4 7.5 10.5 7.5a10.6 10.6 0 0 0 4.9-1.2" />
    </svg>
  );
}

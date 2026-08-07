import { forwardRef } from 'react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'dashed' | 'ghost' | 'link'
type ButtonSize = 'sm' | 'md'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground font-600 hover:opacity-90 active:scale-[0.98]',
  secondary: 'border border-border text-foreground font-500 hover:bg-secondary',
  danger: 'bg-rose-600 text-white font-600 hover:bg-rose-700',
  dashed: 'border-2 border-dashed border-border text-muted-foreground font-500 hover:border-primary hover:text-primary',
  ghost: 'font-500 transition-colors',
  link: 'text-xs text-primary font-500 hover:underline',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
}

// These variants are laid out by the caller (tabs, inline text actions),
// so they opt out of the default padding/size classes entirely.
const UNSIZED_VARIANTS: ButtonVariant[] = ['link', 'ghost']

function buttonClasses(variant: ButtonVariant, size: ButtonSize, className: string) {
  const sizing = UNSIZED_VARIANTS.includes(variant) ? '' : sizeClasses[size]
  return `inline-flex items-center justify-center gap-2 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizing} ${className}`
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className = '', type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  )
})

// Link-styled-as-button, for navigation to a real page (e.g. "+ Add stock")
// rather than an in-place action — keeps the same visual language as Button
// without duplicating its class logic.
type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
}

export function LinkButton({ href, variant = 'primary', size = 'md', className = '', ...props }: LinkButtonProps) {
  return <Link href={href} className={buttonClasses(variant, size, className)} {...props} />
}

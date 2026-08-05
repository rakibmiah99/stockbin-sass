import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

type FileInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(
  { className = '', ...props }, ref
) {
  return (
    <input
      ref={ref}
      type="file"
      className={`text-sm text-muted-foreground file:mr-4 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-secondary file:text-secondary-foreground file:text-sm file:font-500 hover:file:bg-secondary/80 file:cursor-pointer cursor-pointer ${className}`}
      {...props}
    />
  )
})

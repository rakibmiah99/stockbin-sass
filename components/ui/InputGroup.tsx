import type { InputHTMLAttributes, ReactNode } from 'react'
import { Label } from './Label'
import { Input } from './Input'

type InputGroupProps = {
  id: string
  label: string
  action?: ReactNode
} & InputHTMLAttributes<HTMLInputElement>

export function InputGroup({ id, label, action, className, ...inputProps }: InputGroupProps) {
  return (
    <div>
      <div className={`flex items-center mb-1.5 ${action ? 'justify-between' : ''}`}>
        <Label htmlFor={id}>{label}</Label>
        {action}
      </div>
      <Input id={id} className={className} {...inputProps} />
    </div>
  )
}

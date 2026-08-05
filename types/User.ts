import type { Role } from './Auth'

export type ManagedUser = {
  id: number
  tenant_id: number
  name: string
  email: string
  role: Role
  is_active: boolean
  pin_login: boolean
  pin: string | null
  has_pin: boolean
}

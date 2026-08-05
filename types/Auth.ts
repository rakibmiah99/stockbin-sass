export type Role = 'admin' | 'manager' | 'salesman'

export type BusinessSettings = {
  id: number
  tenant_id: number
  business_logo: string | null
  business_name: string
  business_email: string | null
  business_phone: string | null
  business_address: string | null
  vat_percent: string
  low_stock_threshold: number
  currency_symbol: string
  invoice_type: 'standard' | 'thermal'
}

export type AuthSession = {
  token: string
  role: Role
  business_settings: BusinessSettings | null
  menus: string[]
}

export type AuthenticatedUser = {
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

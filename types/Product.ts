export type Product = {
  id: number
  tenant_id: number
  category_id: number
  product_code: string
  product_name: string
  product_image: string | null
  unit: string | null
  color: string | null
  size: string | null
  weight: string | null
  price: string
  position: number
  is_active: boolean
  category: { id: number; name: string }
}

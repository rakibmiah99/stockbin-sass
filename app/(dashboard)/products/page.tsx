import { productsApi } from '@/lib/api/products'
import { categoriesApi } from '@/lib/api/categories'
import { colorsApi } from '@/lib/api/colors'
import { sizesApi } from '@/lib/api/sizes'
import { weightsApi } from '@/lib/api/weights'
import { productUnitsApi } from '@/lib/api/product-units'
import { settingsApi } from '@/lib/api/settings'
import { ProductsTable } from '@/components/products/ProductsTable'

export default async function ProductsPage() {
  const [productsRes, categoriesRes, colorsRes, sizesRes, weightsRes, unitsRes, settingsRes] = await Promise.all([
    productsApi.list(),
    categoriesApi.list(),
    colorsApi.list(),
    sizesApi.list(),
    weightsApi.list(),
    productUnitsApi.list(),
    settingsApi.getBusinessSettings(),
  ])

  const currencySymbol = (settingsRes.success && settingsRes.data?.currency_symbol) || '৳'

  return (
    <div className="p-6">
      <ProductsTable
        products={productsRes.success ? productsRes.data : []}
        categories={categoriesRes.success ? categoriesRes.data : []}
        colors={colorsRes.success ? colorsRes.data : []}
        sizes={sizesRes.success ? sizesRes.data : []}
        weights={weightsRes.success ? weightsRes.data : []}
        units={unitsRes.success ? unitsRes.data : []}
        currencySymbol={currencySymbol}
      />
    </div>
  )
}

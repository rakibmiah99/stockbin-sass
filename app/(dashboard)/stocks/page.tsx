import { productStocksApi } from '@/lib/api/product-stocks'
import { productsApi } from '@/lib/api/products'
import { settingsApi } from '@/lib/api/settings'
import { StocksTable } from '@/components/stocks/StocksTable'

export default async function StocksPage() {
  const [stocksRes, productsRes, settingsRes] = await Promise.all([
    productStocksApi.list(),
    productsApi.list(),
    settingsApi.getBusinessSettings(),
  ])

  const currencySymbol = (settingsRes.success && settingsRes.data?.currency_symbol) || '৳'

  return (
    <div className="p-6">
      <StocksTable
        stocks={stocksRes.success ? stocksRes.data : []}
        products={productsRes.success ? productsRes.data : []}
        currencySymbol={currencySymbol}
      />
    </div>
  )
}

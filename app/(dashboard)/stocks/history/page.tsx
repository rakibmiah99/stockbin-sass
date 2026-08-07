import { productsApi } from '@/lib/api/products'
import { productStockHistoryApi } from '@/lib/api/product-stock-history'
import { settingsApi } from '@/lib/api/settings'
import { StockHistoryView } from '@/components/stocks/StockHistoryView'
import type { StockHistoryPeriod } from '@/types/Stock'

type SearchParams = { product_id?: string; period?: string; from_date?: string; to_date?: string }

export default async function StockHistoryPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const period = (params.period as StockHistoryPeriod) || 'last_100_records'
  const productId = params.product_id ?? ''

  let apiPeriod: StockHistoryPeriod = period
  let apiFromDate: string | undefined
  let apiToDate: string | undefined

  if (period === 'custom') {
    // A custom range needs both ends before it's valid — fall back to the
    // default list until the user has picked both dates.
    if (params.from_date && params.to_date) {
      apiFromDate = params.from_date
      apiToDate = params.to_date
    } else {
      apiPeriod = 'last_100_records'
    }
  }

  const [productsRes, settingsRes, historyRes] = await Promise.all([
    productsApi.list(),
    settingsApi.getBusinessSettings(),
    productId
      ? productStockHistoryApi.list({ product_id: productId, period: apiPeriod, from_date: apiFromDate, to_date: apiToDate })
      : Promise.resolve(null),
  ])

  const products = productsRes.success ? productsRes.data : []
  const currencySymbol = (settingsRes.success && settingsRes.data?.currency_symbol) || '৳'
  const history = historyRes?.success ? historyRes.data : []

  return (
    <div className="p-6">
      <StockHistoryView
        products={products}
        history={history}
        currencySymbol={currencySymbol}
        filters={{
          product_id: productId,
          period,
          from_date: params.from_date ?? '',
          to_date: params.to_date ?? '',
        }}
      />
    </div>
  )
}

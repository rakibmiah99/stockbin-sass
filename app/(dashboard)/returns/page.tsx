import { saleReturnsApi } from '@/lib/api/sale-returns'
import { settingsApi } from '@/lib/api/settings'
import { getSaleReturnAction } from '@/actions/sale-returns'
import { ReturnsListTable } from '@/components/returns/ReturnsListTable'
import type { ReturnListPeriod } from '@/types/SaleReturn'

type SearchParams = { period?: string; from_date?: string; to_date?: string; search?: string }

export default async function ReturnsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const period = (params.period as ReturnListPeriod) || 'last_100_records'
  const search = params.search ?? ''

  const [returnsRes, settingsRes] = await Promise.all([
    saleReturnsApi.list({
      search: search || undefined,
      period: search ? undefined : period,
      from_date: search ? undefined : params.from_date,
      to_date: search ? undefined : params.to_date,
    }),
    settingsApi.getBusinessSettings(),
  ])

  const currencySymbol = (settingsRes.success && settingsRes.data?.currency_symbol) || '৳'

  return (
    <div className="p-6">
      <ReturnsListTable
        title="Returns"
        createLabel="+ New return"
        qtyLabel="Restocked qty"
        qtyKey="total_restocked_qty"
        fetchDetail={getSaleReturnAction}
        returns={returnsRes.success ? returnsRes.data : []}
        currencySymbol={currencySymbol}
        filters={{ period, from_date: params.from_date ?? '', to_date: params.to_date ?? '', search }}
      />
    </div>
  )
}

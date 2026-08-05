import { customersApi } from '@/lib/api/customers'
import { settingsApi } from '@/lib/api/settings'
import { CustomersTable } from '@/components/customers/CustomersTable'

export default async function CustomersPage() {
  const [customersRes, settingsRes] = await Promise.all([
    customersApi.list(),
    settingsApi.getBusinessSettings(),
  ])

  const customers = customersRes.success ? customersRes.data : []
  const currencySymbol = (settingsRes.success && settingsRes.data?.currency_symbol) || '৳'

  return (
    <div className="p-6">
      <CustomersTable customers={customers} currencySymbol={currencySymbol} />
    </div>
  )
}

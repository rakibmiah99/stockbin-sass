import { cookies } from 'next/headers'
import { expensesApi } from '@/lib/api/expenses'
import { expenseCategoriesApi } from '@/lib/api/expense-categories'
import { settingsApi } from '@/lib/api/settings'
import { ExpensesTable } from '@/components/expenses/ExpensesTable'
import { TIMEZONE_COOKIE } from '@/lib/auth/constants'
import { formatDateInTimezone, getMonthStart } from '@/lib/date'
import type { ExpensePeriod, ExpenseUiPeriod } from '@/types/Expense'

type SearchParams = { period?: string; from_date?: string; to_date?: string; expense_category_id?: string }

export default async function ExpensesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const uiPeriod = (params.period as ExpenseUiPeriod) || 'last_100_records'

  const cookieStore = await cookies()
  const timezone = cookieStore.get(TIMEZONE_COOKIE)?.value || 'UTC'
  const today = formatDateInTimezone(new Date(), timezone)

  let apiPeriod: ExpensePeriod = 'last_100_records'
  let apiFromDate: string | undefined
  let apiToDate: string | undefined

  if (uiPeriod === 'this_month') {
    apiPeriod = 'custom'
    apiFromDate = getMonthStart(today)
    apiToDate = today
  } else if (uiPeriod === 'custom') {
    // A custom range needs both ends before it's valid — fall back to the
    // default list until the user has picked both dates.
    if (params.from_date && params.to_date) {
      apiPeriod = 'custom'
      apiFromDate = params.from_date
      apiToDate = params.to_date
    }
  } else {
    apiPeriod = uiPeriod
  }

  const [expensesRes, categoriesRes, settingsRes] = await Promise.all([
    expensesApi.list({
      period: apiPeriod,
      from_date: apiFromDate,
      to_date: apiToDate,
      expense_category_id: params.expense_category_id,
    }),
    expenseCategoriesApi.list(),
    settingsApi.getBusinessSettings(),
  ])

  const expenses = expensesRes.success ? expensesRes.data : []
  const categories = categoriesRes.success ? categoriesRes.data : []
  const currencySymbol = (settingsRes.success && settingsRes.data?.currency_symbol) || '৳'

  return (
    <div className="p-6">
      <ExpensesTable
        expenses={expenses}
        categories={categories}
        currencySymbol={currencySymbol}
        filters={{
          period: uiPeriod,
          from_date: params.from_date ?? '',
          to_date: params.to_date ?? '',
          expense_category_id: params.expense_category_id ?? '',
        }}
      />
    </div>
  )
}

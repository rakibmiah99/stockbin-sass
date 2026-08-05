import { expenseCategoriesApi } from '@/lib/api/expense-categories'
import { ExpenseCategoriesTable } from '@/components/expense-categories/ExpenseCategoriesTable'

export default async function ExpenseCategoriesPage() {
  const response = await expenseCategoriesApi.list()
  const categories = response.success ? response.data : []

  return (
    <div className="p-6">
      <ExpenseCategoriesTable categories={categories} />
    </div>
  )
}

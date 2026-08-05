import { categoriesApi } from '@/lib/api/categories'
import { CategoriesTable } from '@/components/categories/CategoriesTable'

export default async function CategoriesPage() {
  const response = await categoriesApi.list()
  const categories = response.success ? response.data : []

  return (
    <div className="p-6">
      <CategoriesTable categories={categories} />
    </div>
  )
}

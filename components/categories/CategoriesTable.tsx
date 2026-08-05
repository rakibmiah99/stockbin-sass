'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CategoryFormModal } from './CategoryFormModal'
import { DeleteCategoryButton } from './DeleteCategoryButton'
import { SortCategoriesModal } from './SortCategoriesModal'
import type { Category } from '@/types/Category'

export function CategoriesTable({ categories }: { categories: Category[] }) {
  const [search, setSearch] = useState('')
  const [formModal, setFormModal] = useState<{ open: boolean; category: Category | null }>({ open: false, category: null })
  const [sortOpen, setSortOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return categories
    return categories.filter(c => c.name.toLowerCase().includes(q))
  }, [categories, search])

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-700">Categories</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setSortOpen(true)}>Sort</Button>
          <Button onClick={() => setFormModal({ open: true, category: null })}>+ Add category</Button>
        </div>
      </div>

      <div className="mt-4">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search categories…"
          className="w-full max-w-sm px-4 py-2.5 rounded-xl border border-border bg-card text-card-foreground text-sm outline-none focus:ring-2 focus:ring-ring transition"
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden mt-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Category', 'Products', ''].map(h => (
                  <th key={h} className="text-left text-xs font-600 text-muted-foreground px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={3} className="px-5 py-10 text-center text-sm text-muted-foreground">No categories found.</td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id} className={`hover:bg-muted/40 transition-colors ${i < filtered.length - 1 ? 'border-b border-border' : ''}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {c.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.image} alt={c.name} className="w-8 h-8 rounded-lg object-cover border border-border flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-secondary flex-shrink-0 flex items-center justify-center text-secondary-foreground text-xs font-700">
                          {c.name[0]?.toUpperCase()}
                        </div>
                      )}
                      <span className="font-500">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono">{c.total_product}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Button variant="link" onClick={() => setFormModal({ open: true, category: c })}>Edit</Button>
                      <DeleteCategoryButton id={c.id} name={c.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryFormModal
        open={formModal.open}
        category={formModal.category}
        onClose={() => setFormModal({ open: false, category: null })}
      />
      <SortCategoriesModal open={sortOpen} onClose={() => setSortOpen(false)} categories={categories} />
    </>
  )
}

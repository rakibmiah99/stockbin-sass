'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import type { ReturnFilters, ReturnListPeriod } from '@/types/SaleReturn'

const PERIOD_OPTIONS: { value: ReturnListPeriod; label: string }[] = [
  { value: 'last_100_records', label: 'Last 100 records' },
  { value: 'last_30_days', label: 'Last 30 days' },
  { value: 'last_60_days', label: 'Last 60 days' },
  { value: 'last_90_days', label: 'Last 90 days' },
  { value: 'custom', label: 'Custom range' },
]

const selectClass = 'text-sm px-3 py-2 rounded-xl border border-border bg-card text-foreground outline-none focus:ring-2 focus:ring-ring'

export function ReturnFilterBar({ filters }: { filters: ReturnFilters }) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchValue, setSearchValue] = useState(filters.search)

  function updateParams(next: Partial<ReturnFilters>) {
    const merged = { ...filters, ...next }
    const query = new URLSearchParams()
    if (merged.search) {
      query.set('search', merged.search)
    } else {
      if (merged.period !== 'last_100_records') query.set('period', merged.period)
      if (merged.period === 'custom') {
        if (merged.from_date) query.set('from_date', merged.from_date)
        if (merged.to_date) query.set('to_date', merged.to_date)
      }
    }

    const qs = query.toString()
    router.push(`${pathname}${qs ? `?${qs}` : ''}`)
  }

  function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    updateParams({ search: searchValue.trim() })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 min-w-[260px]">
        <input
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder="Search return no, invoice no, customer…"
          className={`${selectClass} flex-1`}
        />
        <Button type="submit" variant="secondary" size="sm">Search</Button>
        {filters.search && (
          <Button type="button" variant="link" onClick={() => { setSearchValue(''); updateParams({ search: '' }) }}>
            Clear
          </Button>
        )}
      </form>

      {!filters.search && (
        <>
          <select
            value={filters.period}
            onChange={e => updateParams({ period: e.target.value as ReturnListPeriod, from_date: '', to_date: '' })}
            className={selectClass}
          >
            {PERIOD_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {filters.period === 'custom' && (
            <>
              <input type="date" value={filters.from_date} onChange={e => updateParams({ from_date: e.target.value })} className={selectClass} />
              <span className="text-muted-foreground text-sm">to</span>
              <input type="date" value={filters.to_date} onChange={e => updateParams({ to_date: e.target.value })} className={selectClass} />
            </>
          )}
        </>
      )}
    </div>
  )
}

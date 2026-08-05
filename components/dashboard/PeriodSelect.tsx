'use client'

import { useRouter, usePathname } from 'next/navigation'
import type { DashboardPeriod } from '@/types/Dashboard'

const OPTIONS: { value: DashboardPeriod; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'last_7_days', label: 'Last 7 days' },
  { value: 'last_30_days', label: 'Last 30 days' },
  { value: 'last_60_days', label: 'Last 60 days' },
  { value: 'last_90_days', label: 'Last 90 days' },
]

export function PeriodSelect({ period }: { period: DashboardPeriod }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <select
      value={period}
      onChange={e => router.push(`${pathname}?period=${e.target.value}`)}
      className="text-sm px-3 py-2 rounded-xl border border-border bg-card text-foreground outline-none focus:ring-2 focus:ring-ring"
    >
      {OPTIONS.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

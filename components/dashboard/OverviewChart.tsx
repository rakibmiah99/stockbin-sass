'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { DashboardOverview } from '@/types/Dashboard'

function buildChartData(overview: DashboardOverview) {
  const length = overview.sales.chart?.length ?? 0
  const start = new Date(`${overview.from_date}T00:00:00Z`)

  return Array.from({ length }, (_, i) => {
    const date = new Date(start)
    date.setUTCDate(start.getUTCDate() + i)
    return {
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      sales: overview.sales.chart?.[i] ?? 0,
      profit: overview.profit.chart?.[i] ?? 0,
      expenses: overview.expenses.chart?.[i] ?? 0,
    }
  })
}

export function OverviewChart({ overview }: { overview: DashboardOverview }) {
  const data = buildChartData(overview)

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
        <defs>
          <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0A7C6E" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#0A7C6E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }} />
        <Area type="monotone" dataKey="sales" name="Sales" stroke="#0A7C6E" strokeWidth={2} fill="url(#salesFill)" dot={false} activeDot={{ r: 4 }} />
        <Area type="monotone" dataKey="profit" name="Profit" stroke="#8B5CF6" strokeWidth={2} fill="transparent" dot={false} activeDot={{ r: 4 }} />
        <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#F59E0B" strokeWidth={2} fill="transparent" dot={false} activeDot={{ r: 4 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { revenueData } from '@/lib/mock-data'

export function OrdersRevenueBarChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="left" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }} />
        <Bar yAxisId="left" dataKey="revenue" fill="#0A7C6E" radius={[4, 4, 0, 0]} name="Revenue" />
        <Bar yAxisId="right" dataKey="orders" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Orders" />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </BarChart>
    </ResponsiveContainer>
  )
}

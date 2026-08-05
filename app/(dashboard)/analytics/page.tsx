import { StatCard } from '@/components/ui/StatCard'
import { OrdersRevenueBarChart } from '@/components/analytics/OrdersRevenueBarChart'

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-5">
      <h1 className="text-xl font-700">Analytics</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Page views" value="84,210" sub="↑ 18.4% this month" icon="👁" accent="text-primary" />
        <StatCard label="Conversion rate" value="3.7%" sub="↑ 0.4pp vs last month" icon="📊" accent="text-violet-600" />
        <StatCard label="Cart abandonment" value="62.1%" sub="↓ 3.2pp vs last month" icon="🛒" accent="text-amber-600" />
        <StatCard label="Repeat customers" value="41%" sub="↑ 5.1% this month" icon="🔁" accent="text-emerald-600" />
      </div>
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-600 text-sm mb-4">Orders & Revenue · Monthly</h3>
        <OrdersRevenueBarChart />
      </div>
    </div>
  )
}

import { Toggle } from '@/components/ui/Toggle'

const notifications = [
  { label: 'New order placed', desc: 'Receive an email for each new order' },
  { label: 'Order shipped', desc: 'When a fulfillment is marked as shipped' },
  { label: 'Low inventory alert', desc: 'When stock drops below 10 units' },
  { label: 'Customer review received', desc: 'New product review submitted' },
  { label: 'Weekly sales report', desc: 'Summary every Monday at 9am' },
]

export function NotificationsTab() {
  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-5 space-y-0 divide-y divide-border">
        <h3 className="font-600 text-sm pb-4">Email notifications</h3>
        {notifications.map((n, i) => (
          <div key={n.label} className="flex items-center gap-4 py-3">
            <div className="flex-1">
              <div className="text-sm font-500">{n.label}</div>
              <div className="text-xs text-muted-foreground">{n.desc}</div>
            </div>
            <Toggle on={i !== 3} />
          </div>
        ))}
      </div>
    </div>
  )
}

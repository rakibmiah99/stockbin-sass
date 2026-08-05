import { Toggle } from '@/components/ui/Toggle'

const paymentMethods = [
  { name: 'Stripe', desc: 'Credit & debit cards, Apple Pay, Google Pay', active: true, icon: '💳' },
  { name: 'PayPal', desc: 'PayPal accounts and Pay Later', active: true, icon: '🅿️' },
  { name: 'Klarna', desc: 'Buy now, pay later in installments', active: false, icon: '🌀' },
  { name: 'Bank transfer', desc: 'Direct ACH/SEPA bank payments', active: false, icon: '🏦' },
]

export function PaymentsTab() {
  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-600 text-sm">Payment methods</h3>
        {paymentMethods.map(pm => (
          <div key={pm.name} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
            <span className="text-2xl">{pm.icon}</span>
            <div className="flex-1">
              <div className="font-600 text-sm">{pm.name}</div>
              <div className="text-xs text-muted-foreground">{pm.desc}</div>
            </div>
            <Toggle on={pm.active} />
          </div>
        ))}
      </div>
    </div>
  )
}

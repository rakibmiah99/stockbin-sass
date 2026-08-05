import { Button } from '@/components/ui/Button'

const shippingZones = [
  { zone: 'Domestic (US)', rates: '3 rates configured', delivery: '2–5 business days' },
  { zone: 'Europe', rates: '2 rates configured', delivery: '5–10 business days' },
  { zone: 'Rest of world', rates: '1 rate configured', delivery: '10–21 business days' },
]

export function ShippingTab() {
  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-600 text-sm">Shipping zones</h3>
        {shippingZones.map(z => (
          <div key={z.zone} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div>
              <div className="font-500 text-sm">{z.zone}</div>
              <div className="text-xs text-muted-foreground">{z.rates} · {z.delivery}</div>
            </div>
            <Button variant="link">Edit</Button>
          </div>
        ))}
        <Button variant="dashed" className="w-full">+ Add shipping zone</Button>
      </div>
    </div>
  )
}

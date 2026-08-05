'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { BusinessSettingsForm } from './BusinessSettingsForm'
import { VariantOptionsTab } from './VariantOptionsTab'
import { PaymentsTab } from './PaymentsTab'
import { ShippingTab } from './ShippingTab'
import { NotificationsTab } from './NotificationsTab'
import type { BusinessSettings } from '@/types/Auth'
import type { Color, Size, Weight, ProductUnit } from '@/types/Variant'

const tabs = [
  { id: 'general', label: 'General', disabled: false },
  { id: 'variants', label: 'Variant Options', disabled: false },
  { id: 'payments', label: 'Payments', disabled: true },
  { id: 'shipping', label: 'Shipping', disabled: true },
  { id: 'notifications', label: 'Notifications', disabled: true },
] as const

type Tab = typeof tabs[number]['id']

export function SettingsTabs({ businessSettings, colors, sizes, weights, units }: {
  businessSettings: BusinessSettings | null
  colors: Color[]; sizes: Size[]; weights: Weight[]; units: ProductUnit[]
}) {
  const [tab, setTab] = useState<Tab>('general')

  return (
    <div className="space-y-5">
      {/* Tab nav */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 w-fit">
        {tabs.map(t => (
          <Button
            key={t.id}
            variant="ghost"
            disabled={t.disabled}
            onClick={() => setTab(t.id)}
            title={t.disabled ? 'Coming soon' : undefined}
            className={`px-4 py-1.5 rounded-lg text-sm ${
              t.disabled
                ? 'text-muted-foreground/50'
                : tab === t.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </Button>
        ))}
      </div>

      {tab === 'general' && <BusinessSettingsForm businessSettings={businessSettings} />}
      {tab === 'variants' && <VariantOptionsTab colors={colors} sizes={sizes} weights={weights} units={units} />}
      {tab === 'payments' && <PaymentsTab />}
      {tab === 'shipping' && <ShippingTab />}
      {tab === 'notifications' && <NotificationsTab />}
    </div>
  )
}

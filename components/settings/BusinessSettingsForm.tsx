'use client'

import { useActionState } from 'react'
import { saveBusinessSettingsAction } from '@/actions/settings'
import { FormAlert } from '@/components/ui/FormAlert'
import { InputGroup } from '@/components/ui/InputGroup'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import { FileInput } from '@/components/ui/FileInput'
import type { BusinessSettings } from '@/types/Auth'

export function BusinessSettingsForm({ businessSettings }: { businessSettings: BusinessSettings | null }) {
  const [state, formAction, pending] = useActionState(saveBusinessSettingsAction, undefined)

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="_exists" value={businessSettings ? '1' : ''} />
      {state?.error && <FormAlert>{state.error}</FormAlert>}
      {state?.success && (
        <div className="rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 text-sm px-4 py-2.5">
          Business settings saved.
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-600 text-sm">Store information</h3>
        <div>
          <Label htmlFor="business_logo" className="block mb-1.5">Business logo</Label>
          <div className="flex items-center gap-4">
            {businessSettings?.business_logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={businessSettings.business_logo} alt="Business logo"
                className="w-14 h-14 rounded-xl object-cover border border-border flex-shrink-0"
              />
            )}
            <FileInput
              id="business_logo" name="business_logo"
              accept="image/png,image/jpeg,image/webp,image/gif"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">PNG, JPG, WEBP or GIF, up to 2MB.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputGroup id="business_name" name="business_name" label="Business name" required defaultValue={businessSettings?.business_name} />
          <InputGroup id="business_email" name="business_email" type="email" label="Business email" defaultValue={businessSettings?.business_email ?? ''} />
          <InputGroup id="business_phone" name="business_phone" label="Business phone" maxLength={18} defaultValue={businessSettings?.business_phone ?? ''} />
          <InputGroup id="business_address" name="business_address" label="Business address" defaultValue={businessSettings?.business_address ?? ''} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-600 text-sm">Billing &amp; inventory</h3>
        <div className="grid grid-cols-2 gap-4">
          <InputGroup id="currency_symbol" name="currency_symbol" label="Currency symbol" required defaultValue={businessSettings?.currency_symbol ?? '৳'} />
          <InputGroup
            id="vat_percent" name="vat_percent" type="number" step="0.01" min="0" max="100"
            label="VAT %" required defaultValue={businessSettings?.vat_percent ?? '0'}
          />
          <InputGroup
            id="low_stock_threshold" name="low_stock_threshold" type="number" step="1" min="0"
            label="Low stock threshold" required defaultValue={businessSettings?.low_stock_threshold ?? 5}
          />
          <div>
            <Label htmlFor="invoice_type" className="block mb-1.5">Invoice type</Label>
            <select
              id="invoice_type" name="invoice_type" defaultValue={businessSettings?.invoice_type ?? 'standard'}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-card-foreground text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="standard">Standard</option>
              <option value="thermal">Thermal</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}

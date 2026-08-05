import { settingsApi } from '@/lib/api/settings'
import { colorsApi } from '@/lib/api/colors'
import { sizesApi } from '@/lib/api/sizes'
import { weightsApi } from '@/lib/api/weights'
import { productUnitsApi } from '@/lib/api/product-units'
import { SettingsTabs } from '@/components/settings/SettingsTabs'

export default async function SettingsPage() {
  const [settingsRes, colorsRes, sizesRes, weightsRes, unitsRes] = await Promise.all([
    settingsApi.getBusinessSettings(),
    colorsApi.list(),
    sizesApi.list(),
    weightsApi.list(),
    productUnitsApi.list(),
  ])

  // A tenant with no settings yet gets back a non-success envelope (data: []),
  // not `{ success: true, data: null }` — treat that as "not created yet".
  const businessSettings = settingsRes.success ? settingsRes.data : null

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-xl font-700">Shop Settings</h1>
      <SettingsTabs
        businessSettings={businessSettings}
        colors={colorsRes.success ? colorsRes.data : []}
        sizes={sizesRes.success ? sizesRes.data : []}
        weights={weightsRes.success ? weightsRes.data : []}
        units={unitsRes.success ? unitsRes.data : []}
      />
    </div>
  )
}

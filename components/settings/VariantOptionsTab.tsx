import { VariantManager } from './VariantManager'
import {
  createColorAction, updateColorAction, deleteColorAction,
  createSizeAction, updateSizeAction, deleteSizeAction,
  createWeightAction, updateWeightAction, deleteWeightAction,
  createProductUnitAction, updateProductUnitAction, deleteProductUnitAction,
} from '@/actions/variants'
import type { Color, Size, Weight, ProductUnit } from '@/types/Variant'

export function VariantOptionsTab({ colors, sizes, weights, units }: {
  colors: Color[]; sizes: Size[]; weights: Weight[]; units: ProductUnit[]
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <VariantManager
        title="Colors" fieldLabel="Color name"
        items={colors.map(c => ({ id: c.id, name: c.color_name }))}
        createAction={createColorAction} updateAction={updateColorAction} deleteAction={deleteColorAction}
      />
      <VariantManager
        title="Sizes" fieldLabel="Size name"
        items={sizes.map(s => ({ id: s.id, name: s.size_name }))}
        createAction={createSizeAction} updateAction={updateSizeAction} deleteAction={deleteSizeAction}
      />
      <VariantManager
        title="Weights" fieldLabel="Weight name"
        items={weights.map(w => ({ id: w.id, name: w.weight_name }))}
        createAction={createWeightAction} updateAction={updateWeightAction} deleteAction={deleteWeightAction}
      />
      <VariantManager
        title="Units" fieldLabel="Unit name"
        items={units.map(u => ({ id: u.id, name: u.unit_name }))}
        createAction={createProductUnitAction} updateAction={updateProductUnitAction} deleteAction={deleteProductUnitAction}
      />
    </div>
  )
}

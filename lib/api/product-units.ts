import { createSimpleCrudApi } from './simple-crud'
import type { ProductUnit } from '@/types/Variant'

export const productUnitsApi = createSimpleCrudApi<ProductUnit>('/api/product-units', 'unit_name')

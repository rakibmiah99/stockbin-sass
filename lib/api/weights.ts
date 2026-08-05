import { createSimpleCrudApi } from './simple-crud'
import type { Weight } from '@/types/Variant'

export const weightsApi = createSimpleCrudApi<Weight>('/api/weights', 'weight_name')

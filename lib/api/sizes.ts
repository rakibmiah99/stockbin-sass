import { createSimpleCrudApi } from './simple-crud'
import type { Size } from '@/types/Variant'

export const sizesApi = createSimpleCrudApi<Size>('/api/sizes', 'size_name')

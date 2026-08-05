import { createSimpleCrudApi } from './simple-crud'
import type { Color } from '@/types/Variant'

export const colorsApi = createSimpleCrudApi<Color>('/api/colors', 'color_name')

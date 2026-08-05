import { apiFetch } from './client'
import type { ApiResponse } from '@/types/Api'

export type SimpleCrudApi<T> = {
  list: () => Promise<ApiResponse<T[]>>
  create: (name: string) => Promise<ApiResponse<T>>
  update: (id: number, name: string) => Promise<ApiResponse<T>>
  remove: (id: number) => Promise<ApiResponse<null>>
}

// Colors, Sizes, Weights, and Product Units are all `{ id, tenant_id, <field>_name }`
// with identical list/create/update/delete verbs — this factory avoids repeating
// that plumbing four times while keeping each a distinct module (own file, own name).
export function createSimpleCrudApi<T>(endpoint: string, fieldName: string): SimpleCrudApi<T> {
  return {
    list() {
      return apiFetch<T[]>(endpoint)
    },
    create(name: string) {
      return apiFetch<T>(endpoint, { method: 'POST', body: { [fieldName]: name } })
    },
    update(id: number, name: string) {
      return apiFetch<T>(`${endpoint}/${id}`, { method: 'PUT', body: { [fieldName]: name } })
    },
    remove(id: number) {
      return apiFetch<null>(`${endpoint}/${id}`, { method: 'DELETE' })
    },
  }
}

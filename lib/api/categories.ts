import { apiRequest } from "./client";

export interface Category {
  id: number;
  tenant_id: number;
  name: string;
  image: string | null;
  sort_order: number;
  total_product: number;
}

export interface CategoryPayload {
  name: string;
}

export const categoriesApi = {
  list: (token: string) => apiRequest<Category[]>("/categories", { token }),

  create: (token: string, payload: CategoryPayload) =>
    apiRequest<Category>("/categories", { method: "POST", body: payload, token }),

  /** Create with an `image` file — multipart/form-data on the same create endpoint. */
  createWithImage: (token: string, formData: FormData) =>
    apiRequest<Category>("/categories", { method: "POST", body: formData, token }),

  update: (token: string, id: number, payload: CategoryPayload) =>
    apiRequest<Category>(`/categories/${id}`, { method: "PUT", body: payload, token }),

  /** Update with an `image` file — dedicated multipart endpoint (PUT can't carry file uploads). */
  updateWithImage: (token: string, id: number, formData: FormData) =>
    apiRequest<Category>(`/categories/${id}/update`, { method: "POST", body: formData, token }),

  remove: (token: string, id: number) => apiRequest<null>(`/categories/${id}`, { method: "DELETE", token }),
};

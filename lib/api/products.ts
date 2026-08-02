import { apiRequest } from "./client";

export interface Product {
  id: number;
  tenant_id: number;
  category_id: number;
  product_code: string;
  product_name: string;
  product_image: string | null;
  unit: string;
  color: string | null;
  size: string | null;
  weight: string | null;
  price: string;
  position: number;
  is_active: boolean;
  category: {
    id: number;
    name: string;
  };
}

export interface ProductPayload {
  category_id: number;
  product_name: string;
  unit: string;
  color?: string;
  size?: string;
  weight?: string;
  price: number;
  is_active?: boolean;
}

export const productsApi = {
  list: (token: string) => apiRequest<Product[]>("/products", { token }),

  create: (token: string, payload: ProductPayload) =>
    apiRequest<Product>("/products", { method: "POST", body: payload, token }),

  /** Create with a `product_image` file — multipart/form-data on the same create endpoint. */
  createWithImage: (token: string, formData: FormData) =>
    apiRequest<Product>("/products", { method: "POST", body: formData, token }),

  update: (token: string, id: number, payload: ProductPayload) =>
    apiRequest<Product>(`/products/${id}`, { method: "PUT", body: payload, token }),

  /** Update with a `product_image` file — dedicated multipart endpoint (PUT can't carry file uploads). */
  updateWithImage: (token: string, id: number, formData: FormData) =>
    apiRequest<Product>(`/products/${id}/update`, { method: "POST", body: formData, token }),

  remove: (token: string, id: number) => apiRequest<null>(`/products/${id}`, { method: "DELETE", token }),
};

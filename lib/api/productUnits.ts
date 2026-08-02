import { apiRequest } from "./client";

export interface ProductUnit {
  id: number;
  tenant_id: number;
  unit_name: string;
}

export const productUnitsApi = {
  list: (token: string) => apiRequest<ProductUnit[]>("/product-units", { token }),

  create: (token: string, unitName: string) =>
    apiRequest<ProductUnit>("/product-units", { method: "POST", body: { unit_name: unitName }, token }),

  update: (token: string, id: number, unitName: string) =>
    apiRequest<ProductUnit>(`/product-units/${id}`, { method: "PUT", body: { unit_name: unitName }, token }),

  remove: (token: string, id: number) => apiRequest<null>(`/product-units/${id}`, { method: "DELETE", token }),
};

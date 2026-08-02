import { apiRequest } from "./client";

export interface Size {
  id: number;
  tenant_id: number;
  size_name: string;
}

export const sizesApi = {
  list: (token: string) => apiRequest<Size[]>("/sizes", { token }),

  create: (token: string, sizeName: string) =>
    apiRequest<Size>("/sizes", { method: "POST", body: { size_name: sizeName }, token }),

  update: (token: string, id: number, sizeName: string) =>
    apiRequest<Size>(`/sizes/${id}`, { method: "PUT", body: { size_name: sizeName }, token }),

  remove: (token: string, id: number) => apiRequest<null>(`/sizes/${id}`, { method: "DELETE", token }),
};

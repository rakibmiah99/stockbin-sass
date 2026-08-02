import { apiRequest } from "./client";

export interface Weight {
  id: number;
  tenant_id: number;
  weight_name: string;
}

export const weightsApi = {
  list: (token: string) => apiRequest<Weight[]>("/weights", { token }),

  create: (token: string, weightName: string) =>
    apiRequest<Weight>("/weights", { method: "POST", body: { weight_name: weightName }, token }),

  update: (token: string, id: number, weightName: string) =>
    apiRequest<Weight>(`/weights/${id}`, { method: "PUT", body: { weight_name: weightName }, token }),

  remove: (token: string, id: number) => apiRequest<null>(`/weights/${id}`, { method: "DELETE", token }),
};

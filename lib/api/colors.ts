import { apiRequest } from "./client";

export interface Color {
  id: number;
  tenant_id: number;
  color_name: string;
}

export const colorsApi = {
  list: (token: string) => apiRequest<Color[]>("/colors", { token }),

  create: (token: string, colorName: string) =>
    apiRequest<Color>("/colors", { method: "POST", body: { color_name: colorName }, token }),

  update: (token: string, id: number, colorName: string) =>
    apiRequest<Color>(`/colors/${id}`, { method: "PUT", body: { color_name: colorName }, token }),

  remove: (token: string, id: number) => apiRequest<null>(`/colors/${id}`, { method: "DELETE", token }),
};

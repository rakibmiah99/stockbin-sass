import { apiRequest } from "./client";
import {ShopSettingsType} from "@/types/ShopSettingsType";


export interface ShopSettingsPayload {
  shop_name: string;
  shop_email: string;
  shop_phone: string;
  shop_address: string;
  vat_percent: number;
  low_stock_threshold: number;
  currency_symbol: string;
  invoice_type: "standard" | "thermal";
}

export const shopSettingsApi = {
  get: (token: string) => apiRequest<ShopSettingsType>("/business-settings", { token }),

  create: (token: string, payload: ShopSettingsPayload) =>
    apiRequest<ShopSettingsType>("/business-settings", { method: "POST", body: payload, token }),

  update: (token: string, payload: ShopSettingsPayload) =>
    apiRequest<ShopSettingsType>("/business-settings", { method: "PUT", body: payload, token }),

  /** Create with a `shop_logo` file — multipart/form-data on the same create endpoint. */
  createWithLogo: (token: string, formData: FormData) =>
    apiRequest<ShopSettingsType>("/business-settings", { method: "POST", body: formData, token }),

  /** Update with a `shop_logo` file — dedicated multipart endpoint (PUT can't carry file uploads). */
  updateWithLogo: (token: string, formData: FormData) =>
    apiRequest<ShopSettingsType>("/business-settings/update", { method: "POST", body: formData, token }),
};

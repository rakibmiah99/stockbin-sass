import { apiRequest } from "./client";
import { getToken } from "@/lib/auth/session";
import type { ShopSettings } from "./auth";

export const shopSettingsApi = {
  get: () => apiRequest<ShopSettings>("/shop-settings", { token: getToken() }),
};

"use server";

import { redirect } from "next/navigation";
import { shopSettingsApi } from "@/lib/api/shopSettings";
import type { ShopSettingsPayload } from "@/lib/api/shopSettings";
import { ApiError } from "@/lib/api/client";
import { getAuthToken, setSetupRequired } from "@/lib/auth/cookies";

function errorRedirect(message: string, setup: boolean): never {
  const params = new URLSearchParams({ error: message, ...(setup ? { setup: "1" } : {}) });
  redirect(`/dashboard/settings?${params.toString()}`);
}

export async function saveShopSettingsAction(formData: FormData): Promise<void> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const hasExisting = formData.get("has_existing") === "1";
  const setup = formData.get("setup") === "1";

  const payload: ShopSettingsPayload = {
    shop_name: String(formData.get("shop_name") ?? "").trim(),
    shop_email: String(formData.get("shop_email") ?? "").trim(),
    shop_phone: String(formData.get("shop_phone") ?? "").trim(),
    shop_address: String(formData.get("shop_address") ?? "").trim(),
    vat_percent: Number(formData.get("vat_percent") ?? 0),
    low_stock_threshold: Number(formData.get("low_stock_threshold") ?? 0),
    currency_symbol: String(formData.get("currency_symbol") ?? "").trim(),
    invoice_type: formData.get("invoice_type") === "thermal" ? "thermal" : "standard",
  };

  const logo = formData.get("shop_logo");
  const hasLogo = logo instanceof File && logo.size > 0;

  try {
    if (hasLogo) {
      const multipart = new FormData();
      multipart.set("shop_name", payload.shop_name);
      multipart.set("shop_email", payload.shop_email);
      multipart.set("shop_phone", payload.shop_phone);
      multipart.set("shop_address", payload.shop_address);
      multipart.set("vat_percent", String(payload.vat_percent));
      multipart.set("low_stock_threshold", String(payload.low_stock_threshold));
      multipart.set("currency_symbol", payload.currency_symbol);
      multipart.set("invoice_type", payload.invoice_type);
      multipart.set("shop_logo", logo as File);

      if (hasExisting) {
        await shopSettingsApi.updateWithLogo(token, multipart);
      } else {
        await shopSettingsApi.createWithLogo(token, multipart);
      }
    } else if (hasExisting) {
      await shopSettingsApi.update(token, payload);
    } else {
      await shopSettingsApi.create(token, payload);
    }
  } catch (err) {
    errorRedirect(err instanceof ApiError ? err.message : "Something went wrong.", setup);
  }

  await setSetupRequired(false);
  redirect("/dashboard");
}

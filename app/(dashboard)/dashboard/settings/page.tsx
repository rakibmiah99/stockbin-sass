import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { shopSettingsApi } from "@/lib/api/shopSettings";
import { getAuthToken } from "@/lib/auth/cookies";
import { saveShopSettingsAction } from "@/lib/actions/shopSettings";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Shop Settings",
};

export default async function ShopSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string; error?: string }>;
}) {
  const { setup, error } = await searchParams;
  const isSetup = setup === "1";

  const token = await getAuthToken();
  if (!token) redirect("/login");

  const settings = await shopSettingsApi.get(token).catch(() => null);

  return (
    <div className="mx-auto flex w-full flex-col gap-xl">
      <div className="flex flex-col gap-xs">
        <h1 className="text-h4 font-semibold text-foreground">
          {isSetup ? "Set up your shop" : "Shop settings"}
        </h1>
        <p className="text-body text-muted">
          {isSetup
            ? "Tell us about your shop before you get started."
            : "Update your shop details any time."}
        </p>
      </div>

      <form
        action={saveShopSettingsAction}
        encType="multipart/form-data"
        className="flex flex-col gap-lg rounded-lg border border-border bg-surface p-lg"
      >
        <FormError message={error ?? null} />
        <input type="hidden" name="has_existing" value={settings ? "1" : "0"} />
        {isSetup && <input type="hidden" name="setup" value="1" />}

        <FormField id="shop_logo" label="Shop logo">
          <div className="flex items-center gap-base">
            {settings?.shop_logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.shop_logo}
                alt="Current shop logo"
                className="size-14 shrink-0 rounded-md border border-border object-cover"
              />
            ) : null}
            <input
              id="shop_logo"
              name="shop_logo"
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif"
              className="block w-full text-small text-muted file:mr-base file:h-9 file:rounded-md file:border file:border-border file:bg-surface file:px-base file:text-small file:font-medium file:text-foreground hover:file:bg-surface-secondary"
            />
          </div>
          <p className="text-caption text-muted">PNG, JPG, WEBP, or GIF — max 2MB. Leave empty to keep the current logo.</p>
        </FormField>

        <div className="grid grid-cols-1 gap-lg sm:grid-cols-2">
          <FormField id="shop_name" label="Shop name">
            <Input
              id="shop_name"
              name="shop_name"
              required
              defaultValue={settings?.shop_name ?? ""}
              placeholder="Stockbin Shop"
            />
          </FormField>

          <FormField id="shop_email" label="Shop email">
            <Input
              id="shop_email"
              name="shop_email"
              type="email"
              defaultValue={settings?.shop_email ?? ""}
              placeholder="shop@example.com"
            />
          </FormField>

          <FormField id="shop_phone" label="Shop phone">
            <Input
              id="shop_phone"
              name="shop_phone"
              defaultValue={settings?.shop_phone ?? ""}
              placeholder="01700000000"
            />
          </FormField>

          <FormField id="currency_symbol" label="Currency symbol">
            <Input
              id="currency_symbol"
              name="currency_symbol"
              required
              defaultValue={settings?.currency_symbol ?? "৳"}
              placeholder="৳"
            />
          </FormField>

          <FormField id="vat_percent" label="VAT percent">
            <Input
              id="vat_percent"
              name="vat_percent"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={settings?.vat_percent ?? "0"}
            />
          </FormField>

          <FormField id="low_stock_threshold" label="Low stock threshold">
            <Input
              id="low_stock_threshold"
              name="low_stock_threshold"
              type="number"
              min="0"
              required
              defaultValue={settings?.low_stock_threshold ?? 5}
            />
          </FormField>

          <FormField id="invoice_type" label="Invoice type">
            <Select id="invoice_type" name="invoice_type" defaultValue={settings?.invoice_type ?? "standard"}>
              <option value="standard">Standard</option>
              <option value="thermal">Thermal</option>
            </Select>
          </FormField>
        </div>

        <FormField id="shop_address" label="Shop address">
          <Input
            id="shop_address"
            name="shop_address"
            defaultValue={settings?.shop_address ?? ""}
            placeholder="Dhaka"
          />
        </FormField>

        <Button type="submit" fullWidth={isSetup}>
          {isSetup ? "Save and continue" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}

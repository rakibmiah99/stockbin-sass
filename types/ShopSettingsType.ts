export interface ShopSettingsType {
    id: number;
    tenant_id: number;
    business_logo: string | null;
    business_name: string;
    business_email: string;
    business_phone: string;
    business_address: string;
    vat_percent: string;
    low_stock_threshold: number;
    currency_symbol: string;
    invoice_type: string;
}
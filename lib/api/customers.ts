import { apiRequest } from "./client";

export type CustomerPeriod = "last_100_records" | "last_30_days" | "last_60_days" | "last_90_days" | "custom";

export interface Customer {
  id: number;
  tenant_id: number;
  customer_name: string;
  customer_phone: string;
  total_sale: string;
  total_paid: string;
  total_due: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface CustomerListParams {
  period?: CustomerPeriod;
  from_date?: string;
  to_date?: string;
  search?: string;
}

export interface CustomerPayload {
  customer_name: string;
  customer_phone: string;
}

export interface CustomerPaymentPeriodParams {
  period?: CustomerPeriod;
  from_date?: string;
  to_date?: string;
}

export interface CustomerPayment {
  id: number;
  tenant_id: number;
  customer_id: number;
  sale_invoice_id: number;
  amount: string;
  payment_method: string;
  payment_date: string;
  note: string | null;
  created_by: string | null;
  updated_by: string | null;
  customer: {
    id: number;
    customer_name: string;
    customer_phone: string;
  };
  sale_invoice: {
    id: number;
    invoice_no: string;
    invoice_status: string;
    grand_total: string;
    paid_amount: string;
    due_amount: string;
    payment_status: string;
  };
}

function buildListQuery(params: CustomerListParams): string {
  const query = new URLSearchParams();

  if (params.search) {
    // Per the API docs, `search` overrides and ignores every other filter.
    query.set("search", params.search);
  } else {
    query.set("period", params.period ?? "last_100_records");
    if (params.period === "custom") {
      if (params.from_date) query.set("from_date", params.from_date);
      if (params.to_date) query.set("to_date", params.to_date);
    }
  }

  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

function buildPaymentsQuery(params: CustomerPaymentPeriodParams): string {
  const query = new URLSearchParams();
  query.set("period", params.period ?? "last_100_records");
  if (params.period === "custom") {
    if (params.from_date) query.set("from_date", params.from_date);
    if (params.to_date) query.set("to_date", params.to_date);
  }
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export const customersApi = {
  list: (token: string, params: CustomerListParams = {}) =>
    apiRequest<Customer[]>(`/customers${buildListQuery(params)}`, { token }),

  listDue: (token: string) => apiRequest<Customer[]>("/customers/due", { token }),

  create: (token: string, payload: CustomerPayload) =>
    apiRequest<Customer>("/customers", { method: "POST", body: payload, token }),

  update: (token: string, id: number, payload: CustomerPayload) =>
    apiRequest<Customer>(`/customers/${id}`, { method: "PUT", body: payload, token }),

  remove: (token: string, id: number) => apiRequest<null>(`/customers/${id}`, { method: "DELETE", token }),

  payments: (token: string, customerId: number, params: CustomerPaymentPeriodParams = {}) =>
    apiRequest<CustomerPayment[]>(`/customers/${customerId}/payments${buildPaymentsQuery(params)}`, { token }),
};

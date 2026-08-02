import { apiRequest } from "./client";

export type ExpensePeriod = "last_100_records" | "last_30_days" | "last_60_days" | "last_90_days" | "custom";

export interface Expense {
  id: number;
  tenant_id: number;
  expense_category_id: number;
  title: string;
  amount: string;
  expense_date: string;
  note: string | null;
  category: string;
  expense_category: {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    sort_order: number;
  };
}

export interface ExpenseListParams {
  period?: ExpensePeriod;
  from_date?: string;
  to_date?: string;
  expense_category_id?: number;
  search?: string;
}

export interface ExpensePayload {
  expense_category_id: number;
  title: string;
  amount: number;
  expense_date: string;
  note?: string;
}

function buildListQuery(params: ExpenseListParams): string {
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
    if (params.expense_category_id) {
      query.set("expense_category_id", String(params.expense_category_id));
    }
  }

  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export const expensesApi = {
  list: (token: string, params: ExpenseListParams = {}) =>
    apiRequest<Expense[]>(`/expenses${buildListQuery(params)}`, { token }),

  create: (token: string, payload: ExpensePayload) =>
    apiRequest<Expense>("/expenses", { method: "POST", body: payload, token }),

  update: (token: string, id: number, payload: ExpensePayload) =>
    apiRequest<Expense>(`/expenses/${id}`, { method: "PUT", body: payload, token }),

  remove: (token: string, id: number) => apiRequest<null>(`/expenses/${id}`, { method: "DELETE", token }),
};

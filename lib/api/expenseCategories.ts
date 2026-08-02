import { apiRequest } from "./client";

export interface ExpenseCategory {
  id: number;
  tenant_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface ExpenseCategoryPayload {
  name: string;
  description?: string | null;
  is_active?: boolean;
}

export const expenseCategoriesApi = {
  list: (token: string) => apiRequest<ExpenseCategory[]>("/expense-categories", { token }),

  create: (token: string, payload: ExpenseCategoryPayload) =>
    apiRequest<ExpenseCategory>("/expense-categories", { method: "POST", body: payload, token }),

  update: (token: string, id: number, payload: ExpenseCategoryPayload) =>
    apiRequest<ExpenseCategory>(`/expense-categories/${id}`, { method: "PUT", body: payload, token }),

  remove: (token: string, id: number) =>
    apiRequest<null>(`/expense-categories/${id}`, { method: "DELETE", token }),
};

const API_BASE_URL = "https://stockbin.app/api";

/** Shape of every Stockbin API response, per API_DOCUMENTATION.md. */
interface Envelope<T> {
  success: boolean;
  message: string | null;
  data: T;
  errors: string | Record<string, string[]> | null;
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

function formatErrors(errors: Envelope<unknown>["errors"]): string {
  if (!errors) return "Something went wrong. Please try again.";
  if (typeof errors === "string") return errors;
  return Object.values(errors).flat().join(" ");
}

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** A `FormData` body is sent as-is (multipart/form-data); anything else is JSON-encoded. */
  body?: unknown;
  /** Bearer token for protected routes; omit for public `/auth/*` endpoints. */
  token?: string | null;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;
  const isFormData = body instanceof FormData;

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        // Let fetch set the multipart boundary itself when sending FormData.
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        "X-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Couldn't reach the server. Check your connection and try again.");
  }

  if (res.status === 401) {
    throw new ApiError("Unauthenticated.");
  }

  let json: Envelope<T>;
  try {
    json = await res.json();
  } catch {
    throw new ApiError("Unexpected response from the server.");
  }

  if (!json.success) {
    throw new ApiError(formatErrors(json.errors));
  }

  return json.data;
}

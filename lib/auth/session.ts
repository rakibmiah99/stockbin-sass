const TOKEN_KEY = "stockbin_token";

function readStorage(storage: Storage): string | null {
  try {
    return storage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Reads the token from whichever storage holds it (localStorage wins if both are set). */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return readStorage(window.localStorage) ?? readStorage(window.sessionStorage);
}

/**
 * Persists the token. `remember: true` survives browser restarts (localStorage);
 * `remember: false` is cleared when the tab closes (sessionStorage) — this is
 * what the Login page's "Remember me" checkbox controls.
 */
export function setToken(token: string, remember: boolean): void {
  if (typeof window === "undefined") return;
  clearToken();
  (remember ? window.localStorage : window.sessionStorage).setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
}

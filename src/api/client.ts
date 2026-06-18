import { tokenStore } from './tokenStore';
import type { AuthTokens } from '@/types';

// Backend base URL. Override per-environment with VITE_API_BASE_URL.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  body?: unknown;
  headers?: Record<string, string>;
  // Attach the access token (default true).
  auth?: boolean;
  // Skip the refresh-on-401 retry (used by login/refresh themselves).
  skipRefresh?: boolean;
}

// Marker the backend uses when a role's permissions changed since the token
// was issued. This is NOT a normal expiry — refreshing won't help, so we hard
// logout instead.
const PERMISSIONS_CHANGED = 'Permissions have changed';

// Registered by the auth layer so the client can force a logout (clear tokens +
// reset user state) without importing React.
let forcedLogoutHandler: (() => void) | null = null;

export function setForcedLogoutHandler(handler: (() => void) | null): void {
  forcedLogoutHandler = handler;
}

function triggerForcedLogout(): void {
  tokenStore.clear();
  forcedLogoutHandler?.();
}

// Single-flight refresh so concurrent 401s trigger only one refresh call.
let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const refresh = tokenStore.getRefresh();
  if (!refresh) return false;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refresh }),
        });
        if (!res.ok) {
          tokenStore.clear();
          return false;
        }
        const tokens: AuthTokens = await res.json();
        tokenStore.set(tokens.access_token, tokens.refresh_token);
        return true;
      } catch {
        tokenStore.clear();
        return false;
      }
    })();
    refreshPromise.finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function toApiError(res: Response): Promise<ApiError> {
  let data: unknown = null;
  let message = res.statusText || 'Request failed';
  try {
    data = await res.json();
    const detail = (data as { detail?: unknown })?.detail;
    if (typeof detail === 'string') {
      message = detail;
    } else if (Array.isArray(detail)) {
      // FastAPI validation errors: [{ msg, loc, ... }]
      message = detail.map((d) => (d as { msg?: string })?.msg ?? String(d)).join(', ');
    }
  } catch {
    /* response had no JSON body */
  }
  return new ApiError(res.status, message, data);
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, skipRefresh = false, headers, ...rest } = options;

  const buildHeaders = (): Record<string, string> => {
    const h: Record<string, string> = { ...headers };
    if (body !== undefined) h['Content-Type'] = 'application/json';
    if (auth) {
      const token = tokenStore.getAccess();
      if (token) h['Authorization'] = `Bearer ${token}`;
    }
    return h;
  };

  const send = () =>
    fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: buildHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let res = await send();

  if (res.status === 401 && auth && !skipRefresh) {
    const err = await toApiError(res); // consumes the body to inspect `detail`
    const detail = String((err.data as { detail?: unknown })?.detail ?? '');

    // Permissions changed server-side → session is invalid, refresh can't fix it.
    if (detail.includes(PERMISSIONS_CHANGED)) {
      triggerForcedLogout();
      throw err;
    }

    // Normal access-token expiry → refresh once and retry.
    const refreshed = await refreshTokens();
    if (refreshed) {
      res = await send();
    } else {
      triggerForcedLogout();
      throw err;
    }
  }

  if (!res.ok) throw await toApiError(res);

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

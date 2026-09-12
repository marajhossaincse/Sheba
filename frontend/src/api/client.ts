export type Role = "SECRETARY" | "DIRECTOR" | "SHAREHOLDER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  companyId: string;
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  issues?: unknown;

  constructor(status: number, message: string, issues?: unknown) {
    super(message);
    this.status = status;
    this.issues = issues;
  }
}

async function parseJson(res: Response) {
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Cookies carry the JWTs; the browser attaches/receives them automatically
// as long as `credentials: "include"` is set on every request.
async function request<T>(
  path: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (res.status === 401 && !isRetry && path !== "/api/auth/refresh") {
    const refreshed = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshed.ok) {
      return request<T>(path, options, true);
    }
  }

  if (!res.ok) {
    const body = await parseJson(res).catch(() => null);
    throw new ApiError(res.status, body?.error ?? "Request failed", body?.issues);
  }

  return (await parseJson(res)) as T;
}

export const api = {
  signup: (input: { name: string; email: string; password: string; role: Role }) =>
    request<{ user: User }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  login: (input: { email: string; password: string }) =>
    request<{ user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  logout: () => request<void>("/api/auth/logout", { method: "POST" }),
  me: () => request<{ user: User }>("/api/auth/me"),
};

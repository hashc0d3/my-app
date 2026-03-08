import { apiBaseUrl } from "@/src/shared/config/api";

export async function apiFetch(path: string, init?: RequestInit & { admin?: boolean }) {
  const headers = new Headers(init?.headers);
  if (init?.admin) {
    const token = process.env.ADMIN_TOKEN ?? "";
    if (token) headers.set("x-admin-token", token);
  }

  return fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store"
  });
}

import { apiBaseUrl } from "@/src/shared/config/api";

export async function apiFetch(path: string, init?: RequestInit & { admin?: boolean }) {
  const headers = new Headers(init?.headers);
  if (init?.admin) {
    const token = process.env.ADMIN_TOKEN ?? "";
    if (token) headers.set("x-admin-token", token);
  }

  const base = apiBaseUrl.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  const url = `${base}${suffix}`;

  return fetch(url, {
    ...init,
    headers,
    cache: "no-store"
  });
}

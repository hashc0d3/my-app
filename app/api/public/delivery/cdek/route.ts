import { apiBaseUrl } from "@/src/shared/config/api";

async function proxyToBackend(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, "");
  const backendUrl = `${apiBaseUrl}${path}${url.search}`;
  const headers = new Headers(request.headers);
  headers.delete("host");
  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store"
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }
  const res = await fetch(backendUrl, init);
  const data = await res.json().catch(() => ({ message: "Proxy error" }));
  return Response.json(data, { status: res.status });
}

export async function GET(request: Request) {
  return proxyToBackend(request);
}

export async function POST(request: Request) {
  return proxyToBackend(request);
}

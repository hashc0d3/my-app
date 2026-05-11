/**
 * Публичный конфиг как у остальных API ремешков: только same-origin `/api/public/...`,
 * прокси в Next → Nest (без прямых запросов к :4000 из браузера — без CORS).
 */
export async function fetchPublicConfig(): Promise<Response> {
  return fetch("/api/public/app-config", { cache: "no-store" });
}

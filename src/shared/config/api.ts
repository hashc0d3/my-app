/**
 * База URL бэкенда (Nest) для Route Handlers в Next — только переменные сервера.
 * Не подставлять NEXT_PUBLIC_*: его часто задают как адрес фронта (localhost:3002),
 * тогда прокси шёл бы на /admin/config самого Next и отдавал 404.
 */
export const apiBaseUrl =
  process.env.API_BASE_URL ?? process.env.BACKEND_URL ?? "http://localhost:4000";

/** Прямые запросы из браузера к API */
export const publicApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  process.env.BACKEND_URL ??
  "http://localhost:4000";

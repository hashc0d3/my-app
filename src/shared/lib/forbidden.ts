/**
 * Если ответ имеет статус 403 (Forbidden), перенаправляет на страницу /forbidden.
 * Использовать после fetch: if (redirectToForbiddenIfNeeded(response)) return;
 */
export function redirectToForbiddenIfNeeded(response: Response): boolean {
  if (response.status === 403 && typeof window !== "undefined") {
    window.location.href = "/forbidden";
    return true;
  }
  return false;
}

export const APP_ROUTES = {
  home: "/",
  case: "/case",
  cart: "/cart",
  checkout: "/checkout",
} as const;

const STEP_QUERY_PARAM = "step";

export function buildHomeStepRoute(step: number): string {
  return `${APP_ROUTES.home}?${STEP_QUERY_PARAM}=${step}`;
}

export function buildCaseStepRoute(step: number): string {
  return `${APP_ROUTES.case}?${STEP_QUERY_PARAM}=${step}`;
}

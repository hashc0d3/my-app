export const WATCH_CONFIG_STEPS = {
  min: 1,
  max: 4,
  initial: 1,
} as const;

export const CASE_CONFIG_STEPS = {
  min: 1,
  max: 2,
  initial: 1,
} as const;

export function isStepInRange(step: number, min: number, max: number): boolean {
  return Number.isFinite(step) && step >= min && step <= max;
}

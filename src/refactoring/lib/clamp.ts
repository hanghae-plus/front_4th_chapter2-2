export function clamp(value: number, maximum: number): number;
export function clamp(value: number, minimum: number, maximum: number): number;
export function clamp(value: number, bound1: number, bound2?: number) {
  if (bound2 === undefined) {
    return Math.min(value, bound1);
  }
  return Math.min(bound2, Math.max(bound1, value));
}

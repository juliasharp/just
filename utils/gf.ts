// utils/gf.ts
/** Turn "input_1.3" or "input_5" into parent id "1" or "5" */
export function gfParentIdFromKey(gfKey: string): string {
  // "input_" is optional safety; split on "_" then take numbers before dot
  const k = gfKey?.startsWith('input_') ? gfKey.slice(6) : gfKey
  return (k || '').split('.')[0] || ''
}

/** Quick trim check for empty values */
export const isFilled = (v: unknown) =>
  typeof v === 'string' ? v.trim().length > 0 : v != null

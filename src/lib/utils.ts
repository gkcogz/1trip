export const uid = (): string => Math.random().toString(36).slice(2, 10)

export const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, n))

export const currencyFmt = (currency: string, n = 0): string => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n)
  } catch {
    return `${n.toFixed(2)} ${currency}`
  }
}

export function deepClone<T>(v: T): T {
  if (typeof structuredClone === 'function') return structuredClone(v)
  return JSON.parse(JSON.stringify(v))
}

export function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

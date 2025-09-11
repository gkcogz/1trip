export function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function currencyFmt(currency: string, value: number) {
  const v = typeof value === "number" ? value : 0
  try {
    return new Intl.NumberFormat(navigator.language || "en-US", {
      style: "currency",
      currency: currency,
    }).format(v)
  } catch {
    return `${v.toFixed(2)} ${currency}`
  }
}

// ✅ Eksik olan fonksiyon eklendi
export function isNonEmptyString(value: any): value is string {
  return typeof value === "string" && value.trim().length > 0
}

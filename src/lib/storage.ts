import type { Trip } from './types'
import { isNonEmptyString } from './utils'

const KEY = 'onetrip_trip'

export const loadTrip = (): Trip | undefined => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Trip) : undefined
  } catch {
    return undefined
  }
}

export const saveTrip = (t: Trip): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(t))
  } catch {
    // storage dolu olabilir; sessiz geç
  }
}

export const hashEncode = (t: Trip): string =>
  encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(t)))))

export const hashDecode = (): Trip | undefined => {
  try {
    const m = location.hash.match(/plan=([^&]+)/)
    if (!m) return undefined
    const decoded = decodeURIComponent(m[1])
    const json = decodeURIComponent(escape(atob(decoded)))
    const obj = JSON.parse(json)
    if (obj && typeof obj === 'object' && isNonEmptyString((obj as any).id)) {
      return obj as Trip
    }
    return undefined
  } catch {
    return undefined
  }
}
